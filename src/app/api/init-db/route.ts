//import { initDB } from '@/app/lib/initDB'
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        //await initDB();
        return NextResponse.json({success: true, message: "Database initialized"});
    } catch(err) {
        return NextResponse.json({error: err}, {status: 500});
    }
}