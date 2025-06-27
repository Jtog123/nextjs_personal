'use client'
import React from 'react'
import Typed from 'typed.js'




export default function Home() {
  const el = React.useRef(null);


  async function handleClick(platform: string) {
    console.log(`${platform} clicked`);

    try {
      //sends to the route handler
      const res = await fetch("/api/analytics", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform_sent: platform
        })
      });

      //if we get abad response
      if(!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

    } catch(err) {
      console.error("Error: ", err);
    }

    
  }



  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings:[`Hi, I'm <span class="text-pink-800">James.^1000 </span><br/> I spend most of my time programming and reading about technology and business. <br/>There are other things I enjoy too, but this page focuses on the work and ideas I care about most.`],
      typeSpeed: 45,
      showCursor:false
    });

    return () => {
      // desrtoy typed instance on cleanu
      typed.destroy();
    };

  }, [])

  return (
      <div className="display flex flex-col bg-gray-200 h-screen mb-40 items-center justify-center">

        <div className="intro-container  ">
          <h1 ref={el} className="w-full m-10 justify-center text-2xl font-mono font-bold"></h1>
        </div>
          

        <div  className="links-container w-full m-10 flex gap-8 mb-32 justify-center ">

          <div  className="cursor-pointer px-6 py-3 rounded-xl bg-gray-100 shadow-[inset_0_-4px_0_#c1c1c1] border border-gray-300 text-black font-mono font-bold text-lg hover:translate-y-[2px] hover:shadow-[inset_0_-2px_0_#c1c1c1] transition duration-150"
            onClick={() => handleClick("Github")}>
          GitHub
          </div>

          
          <div  className="cursor-pointer px-6 py-3 rounded-xl bg-pink-100 shadow-[inset_0_-4px_0_#e87eb5] border border-pink-300 text-pink-800 font-mono font-bold text-lg hover:translate-y-[2px] hover:shadow-[inset_0_-2px_0_#e87eb5] transition duration-150"
            onClick={() => handleClick("Instagram")}>
          Instagram
          </div>

        </div>

      
      </div>
  );
}
