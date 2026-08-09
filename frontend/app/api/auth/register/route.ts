import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateSessionToken, SESSION_DURATION_MS } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json();

    // Basic validation
    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }

    // Check if username (tenant subdomain) already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { username },
    });
    if (existingTenant) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User + Tenant + Membership together
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        memberships: {
          create: {
            role: "OWNER",
            tenant: {
              create: {
                username,
                displayName: name,
              },
            },
          },
        },
      },
      include: {
        memberships: {
          include: { tenant: true },
        },
      },
    });
    //create a session and log the user in immediately
    const token = generateSessionToken();
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      },
    });
    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 },
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
