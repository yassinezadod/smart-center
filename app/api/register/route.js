// app/api/register/route.js

import { NextResponse } from 'next/server';
import { hashPassword } from '../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    // Save the new user in the database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN', // Assign the SUPER_ADMIN role
      },
    });
    return NextResponse.json({ message: 'Super Admin successfully created!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating Super Admin.' }, { status: 500 });
  }
}
