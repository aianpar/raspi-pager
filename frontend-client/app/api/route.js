import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);


export async function getData() {
    const data = await sql`SELECT * from messages`;
    return data;
}

export async function postData(form) {
    try {
        const { image_id, sender, message } = form;
        const data = await sql`
        INSERT INTO messages (image_id, sender, message)
        VALUES (${image_id}, ${sender}, ${message})
        RETURNING *`;

        console.log("succeess");
        console.log("Data inserted:", data);
        return data;

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await sql`SELECT * from messages`;
        console.log("Data fetched:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}