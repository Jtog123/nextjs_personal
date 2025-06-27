import { NextRequest, NextResponse } from "next/server";
import { initializeOnce, populateTable } from '@/app/lib/initDB'

export async function POST(request: NextRequest){
    // gets the post request from the client and does something with it

    try {

        //init the db only once
        await initializeOnce();

        //extract the request convert to json
        const body = await request.json();
        const { platform_sent } = body;

        console.log("REceived platform: ", platform_sent);

        //send to DB
        const result = await populateTable(platform_sent);
        console.log(result);




        //send resopse back to client
        return NextResponse.json({
            success: true,
            message: `Processed ${platform_sent}`
        });

    } catch(error) {
        console.log("Error: ", error);

        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        );
    }
}