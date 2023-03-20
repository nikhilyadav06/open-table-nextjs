import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import * as jose from 'jose'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, city, password } = req.body

    const errors: string[] = []

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20
        }),
        errorMessage: 'First name is invalid'
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20
        }),
        errorMessage: 'Last name is invalid'
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid'
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid'
      },
      {
        valid: validator.isLength(city, {
          min: 1,
          max: 20
        }),
        errorMessage: 'City is invalid'
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough'
      }
    ]

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage)
      }
    })

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] })
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithEmail) {
      return res.status(400).json({ errorMessage: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        email,
        phone,
        city
      }
    })

    const alg = 'HS256'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret)

    res.status(200).json({
      token
    })
  }

  return res.status(404).json('Unknown endpoint')
}