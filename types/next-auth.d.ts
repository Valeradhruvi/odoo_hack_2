import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@/lib/generated/prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // NextAuth session callbacks usually stringify IDs, but we will try to pass number
            role: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: number; // In Prisma User model it's Int
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
