import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../prisma/prisma"


export const dynamic = 'force-dynamic'


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('query') as string

        if (query.trim() === '') {
            return NextResponse.json({ data: "tidak ada pencarian" }, { status: 401 })
        }

        const berita = await prisma.$queryRaw`
    SELECT * FROM berita
    WHERE LOWER(judul) LIKE LOWER(${`%${query}%`})
    ORDER BY judul ASC
`;

        if (!berita) {
            console.log("search gagal");
            return NextResponse.json({ data: "gagal" }, { status: 500 })
        }
        
        console.log("search berhasil");
        return NextResponse.json({ data: berita }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ data: error }, { status: 500 })
    } finally {
        prisma.$disconnect()
    }
}