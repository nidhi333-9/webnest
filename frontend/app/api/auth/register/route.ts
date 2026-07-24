import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
