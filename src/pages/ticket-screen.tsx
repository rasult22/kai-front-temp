import AnimatingContainer from "@/components/animating-container";
import { Avatar } from "@/components/base/avatar/avatar";
// import { Button } from "@/components/base/buttons/button";
// import { createVideoInviteAndGetUrls } from "@/queries/avatar";
import { useUserData } from "@/queries/user";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import QRCodeSVG from "react-qr-code";

const TicketScreen = () => {
  const navigate = useNavigate()
  const {data: userData} = useUserData()

  // const runVideoGenerations = async () => {
  //   const videos: any[] = []
  //   createVideoInviteAndGetUrls('Мырза').then(data => {
  //     videos.push(data.video_url)
  //     console.log(videos)
  //   })
  //   createVideoInviteAndGetUrls('Гайникен').then(data => {
  //     videos.push(data.video_url)
  //     console.log(videos)
  //   })
  //   createVideoInviteAndGetUrls('Милена').then(data => {
  //     videos.push(data.video_url)
  //     console.log(videos)
  //   })
  //   createVideoInviteAndGetUrls('Азамат').then(data => {
  //     videos.push(data.video_url)
  //     console.log(videos)
  //   })
  //   createVideoInviteAndGetUrls('Расул').then(data => {
  //     videos.push(data.video_url)
  //     console.log(videos)
  //   })
  // }
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
           <div className="max-w-[296px] mx-auto pt-5">
                <div className="text-[24px] leading-[32px] font-bold text-center">Входной билет</div>
                <div className="text-center text-[14px] leading-[20px] text-text-tertiary mt-4">Войдите на территорию по QR-билету или с помощью Face ID</div>
           </div>
           {userData?.unique_url_id && (
             <div className="mx-auto mt-6 bg-white p-4 rounded-lg max-w-[300px]">
               <QRCodeSVG
                 value={`https://d3tjjv9lc5ah7w.cloudfront.net/client/${userData.unique_url_id}`}
                 size={268}
                 level="H"
               />
             </div>
           )}
           <div className="flex flex-col justify-center items-center mt-8">
             <Avatar
               size="2xl"
               src={WebApp.initDataUnsafe.user?.photo_url}
             />
             <div className="font-semibold text-[18px] leading-[28px] mt-4">{`${userData?.fullname || ''}`}</div>
             <div className="text-text-brand-secondary">Участник слета</div>
             {/* <Button onClick={runVideoGenerations}>Run video generations</Button> */}
           </div>
           <div onClick={() => {
            navigate('/ai-diagnostics')
           }} className="flex justify-center items-center mt-10 pb-4">
              <Logo />
           </div>
        </AnimatingContainer>
    );
};

export default TicketScreen;

function Logo() {
    return (<svg width="193" height="32" viewBox="0 0 193 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M146.559 11.8805C146.559 10.68 146.021 10.0038 145.331 9.70022C145.869 9.32765 146.228 8.76189 146.228 7.82355C146.228 6.38845 145.235 5.33972 143.73 5.33972H140.129V14.5161H143.813C145.607 14.5161 146.573 13.5502 146.573 11.8667L146.559 11.8805ZM141.274 6.42985H143.413C144.462 6.42985 145.041 6.96801 145.041 7.83735C145.041 8.91368 144.338 9.27245 143.413 9.27245H141.274V6.44365V6.42985ZM141.274 13.4536V10.3074H143.634C144.752 10.3074 145.373 10.8041 145.373 11.8805C145.373 12.9568 144.71 13.4536 143.634 13.4536H141.274Z" fill="white"/>
                <path d="M153.722 12.1155V7.82397H152.604V11.8671C152.604 12.9986 152.107 13.6058 151.031 13.6058C149.954 13.6058 149.444 12.9986 149.444 11.8671V7.82397H148.326V12.1155C148.326 13.6472 149.265 14.6545 151.031 14.6545C152.797 14.6545 153.722 13.661 153.722 12.1155Z" fill="white"/>
                <path d="M159.048 10.7357L157.613 10.377C157.144 10.2528 156.757 10.0872 156.757 9.59042C156.757 9.09365 157.199 8.70728 158.096 8.70728C158.938 8.70728 159.545 9.07986 159.572 9.8664H160.649C160.649 8.59689 159.614 7.69995 158.096 7.69995C156.578 7.69995 155.695 8.52789 155.695 9.59042C155.695 10.5426 156.275 11.1359 157.227 11.3705L158.8 11.7707C159.407 11.9225 159.697 12.2122 159.697 12.6262C159.697 13.192 159.131 13.5921 158.165 13.5921C157.199 13.5921 156.523 13.192 156.523 12.3088H155.419C155.46 13.8681 156.578 14.6409 158.165 14.6409C159.835 14.6409 160.814 13.7715 160.814 12.6262C160.814 11.6051 160.18 11.0255 159.048 10.7357Z" fill="white"/>
                <path d="M163.754 5.14709H162.525V6.43041H163.754V5.14709Z" fill="white"/>
                <path d="M163.685 7.82397H162.581V14.5303H163.685V7.82397Z" fill="white"/>
                <path d="M168.983 7.7135C168.086 7.7135 167.451 8.01708 167.092 8.51385V7.83769H165.975V14.544H167.092V10.5009C167.092 9.259 167.837 8.76223 168.734 8.76223C169.797 8.76223 170.335 9.36939 170.335 10.5009V14.544H171.453V10.2525C171.453 8.72083 170.473 7.7273 168.983 7.7273V7.7135Z" fill="white"/>
                <path d="M175.925 7.7135C174.241 7.7135 173.151 8.73463 173.151 10.5147V11.8394C173.151 13.6195 174.241 14.6406 175.925 14.6406C177.401 14.6406 178.533 13.8265 178.657 12.4052H177.539C177.415 13.3021 176.739 13.5919 175.925 13.5919C174.959 13.5919 174.269 13.1917 174.269 11.8394V11.5772H178.671V10.5147C178.643 8.59664 177.498 7.7135 175.925 7.7135ZM177.553 10.5975H174.269V10.5147C174.269 9.1762 174.945 8.73463 175.925 8.73463C176.808 8.73463 177.526 9.1762 177.553 10.5147V10.5975Z" fill="white"/>
                <path d="M183.596 10.7357L182.161 10.377C181.692 10.2528 181.305 10.0872 181.305 9.59042C181.305 9.09365 181.747 8.70728 182.644 8.70728C183.486 8.70728 184.093 9.07986 184.12 9.8664H185.197C185.197 8.59689 184.162 7.69995 182.644 7.69995C181.126 7.69995 180.243 8.52789 180.243 9.59042C180.243 10.5426 180.822 11.1359 181.774 11.3705L183.348 11.7707C183.955 11.9225 184.244 12.2122 184.244 12.6262C184.244 13.192 183.679 13.5921 182.713 13.5921C181.747 13.5921 181.071 13.192 181.071 12.3088H179.967C180.008 13.8681 181.126 14.6409 182.713 14.6409C184.382 14.6409 185.362 13.7715 185.362 12.6262C185.362 11.6051 184.727 11.0255 183.596 10.7357Z" fill="white"/>
                <path d="M190.303 10.7357L188.868 10.377C188.399 10.2528 188.012 10.0872 188.012 9.59042C188.012 9.09365 188.454 8.70728 189.351 8.70728C190.193 8.70728 190.8 9.07986 190.827 9.8664H191.904C191.904 8.59689 190.869 7.69995 189.351 7.69995C187.833 7.69995 186.95 8.52789 186.95 9.59042C186.95 10.5426 187.529 11.1359 188.482 11.3705L190.055 11.7707C190.662 11.9225 190.952 12.2122 190.952 12.6262C190.952 13.192 190.386 13.5921 189.42 13.5921C188.454 13.5921 187.778 13.192 187.778 12.3088H186.674C186.715 13.8681 187.833 14.6409 189.42 14.6409C191.09 14.6409 192.069 13.7715 192.069 12.6262C192.069 11.6051 191.434 11.0255 190.303 10.7357Z" fill="white"/>
                <path d="M145.649 18.5872V17.5385H140.874V19.8291L141.812 21.0572C140.778 21.4574 140.019 22.4371 140.019 23.8032C140.019 25.6937 141.385 26.839 143.179 26.839C144.2 26.839 144.931 26.5768 145.58 25.9697L146.159 26.7148H147.567L141.205 18.5872H145.649ZM144.972 25.1693C144.572 25.5695 144.062 25.8179 143.192 25.8179C142.199 25.8179 141.164 25.1969 141.164 23.817C141.164 22.8235 141.743 22.1611 142.53 21.9817L144.986 25.1831L144.972 25.1693Z" fill="white"/>
                <path d="M154.702 17.5385L151.846 26.7148H153.115L153.819 24.3414H157.669L158.373 26.7148H159.642L156.813 17.5385H154.688H154.702ZM154.136 23.2927L155.751 17.8558L157.365 23.2927H154.136Z" fill="white"/>
                <path d="M160.967 18.6286H162.885V25.6247H160.967V26.7148H165.99V25.6247H164.072V18.6286H165.99V17.5385H160.967V18.6286Z" fill="white"/>
                <path d="M0 7.74105H6.26477V26.7423H8.99698V7.74105H15.2755V5.21582H0V7.74105Z" fill="white"/>
                <path d="M25.0179 10.6805C22.9204 10.6805 21.5129 11.2877 20.5746 12.5296V5.20227H17.9941V26.7288H20.5746V17.1246C20.5746 14.2406 22.3684 13.1091 24.4383 13.1091C26.9083 13.1091 28.2054 14.5028 28.2054 17.1246V26.7288H30.7859V16.5451C30.7859 12.9849 28.44 10.6805 25.0041 10.6805H25.0179Z" fill="white"/>
                <path d="M39.9488 10.6801C36.0575 10.6801 33.5322 13.0535 33.5322 17.1932V20.2704C33.5322 24.4101 36.0575 26.7835 39.9488 26.7835C43.3848 26.7835 46.0066 24.8931 46.2687 21.6089H43.6883C43.4123 23.6788 41.8393 24.3411 39.9488 24.3411C37.6995 24.3411 36.1126 23.4304 36.1126 20.2704V19.6632H46.2963V17.1932C46.2412 12.7499 43.5917 10.6801 39.935 10.6801H39.9488ZM43.7297 17.3726H36.1264V17.1932C36.1264 14.0884 37.7133 13.0535 39.9626 13.0535C42.0048 13.0535 43.6745 14.0884 43.7297 17.1932V17.3726Z" fill="white"/>
                <path d="M75.7301 5.24341H71.7422V26.7423H74.1018H75.7301H85.7482V22.7544H75.7301V17.9937H84.7271V13.992H75.7301V9.23134H85.7482V5.24341H75.7301Z" fill="url(#paint0_linear_443_7843)"/>
                <path d="M64.9249 25.8592L59.5157 5.24341H55.445H55.2104H51.457V26.7423H55.445V6.12655L60.8542 26.7423H64.9249H65.1595H68.9266V5.24341H64.9249V25.8592Z" fill="url(#paint1_linear_443_7843)"/>
                <path d="M119.858 5.24341H115.553H106.639V9.23134H114.504L109.909 26.7423H114.214L118.809 9.23134H123.129V5.24341H119.858Z" fill="url(#paint2_linear_443_7843)"/>
                <path d="M100.471 5.24341L96.2766 12.3499L92.0679 5.24341H87.7764L94.1239 15.9929L87.7764 26.7423H92.0679L96.2766 19.6358L100.471 26.7423H104.777L98.4292 15.9929L104.777 5.24341H100.471Z" fill="url(#paint3_linear_443_7843)"/>
                <path d="M131.975 0H131.188V32H131.975V0Z" fill="white"/>
                <defs>
                <linearGradient id="paint0_linear_443_7843" x1="47.0695" y1="15.9929" x2="122.799" y2="15.9929" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="0.33" stopColor="#BB1718"/>
                <stop offset="0.67" stopColor="#E5610B"/>
                <stop offset="1" stopColor="#D3BDA5"/>
                </linearGradient>
                <linearGradient id="paint1_linear_443_7843" x1="47.0689" y1="-67.4638" x2="122.798" y2="-67.4638" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="0.33" stopColor="#BB1718"/>
                <stop offset="0.67" stopColor="#E5610B"/>
                <stop offset="1" stopColor="#D3BDA5"/>
                </linearGradient>
                <linearGradient id="paint2_linear_443_7843" x1="47.0682" y1="-67.4638" x2="122.797" y2="-67.4638" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="0.33" stopColor="#BB1718"/>
                <stop offset="0.67" stopColor="#E5610B"/>
                <stop offset="1" stopColor="#D3BDA5"/>
                </linearGradient>
                <linearGradient id="paint3_linear_443_7843" x1="47.0692" y1="-67.4638" x2="122.798" y2="-67.4638" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="0.33" stopColor="#BB1718"/>
                <stop offset="0.67" stopColor="#E5610B"/>
                <stop offset="1" stopColor="#D3BDA5"/>
                </linearGradient>
                </defs>
            </svg>)
}