import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes, useNavigate} from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { NetworkingScreen } from "./pages/networking-screen";
import { AIVideoScreen } from "./pages/ai-video-screen";
import BottomNav from "./components/bottom-nav";
import { VotingScreen } from "./pages/voting-screen";
import { OnboardingScreen } from "./pages/onboarding/onboarding-screen";
import AnimatingContainer from "./components/animating-container";
import { TutorialScreen } from "./pages/tutorial-screen";
import WebApp from '@twa-dev/sdk'
import TicketScreen from "./pages/ticket-screen";
import { MkScreen } from "./pages/mk-screen";
import { FaceVerificationScreen } from "./pages/face-verification-screen";
import CreateVideoScreen from "./pages/create-video-screen";
import CreateVideoResultScreen from "./pages/create-video-result-screen";
import MkCallScreen from "./pages/mk-call-screen";
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { queryClient } from "./queries";
import { useUserData } from "./queries/user";
import FullScreenLoader from "./components/fullscreen-loader";
import { Button } from "./components/base/buttons/button";
import ClubLandingScreen from "./pages/club-landing-screen";
import ProfileScreen from "./pages/profile-screen";
import AIDiagnosticsScreen from "./pages/ai-diagnostics-screen";
import AIDiagnosticsResultScreen from "./pages/ai-diagnostics-result-screen";
import ChatTestScreen from "./pages/chat-test-screen";
import Travel01Screen from "./pages/travel-01-screen";
import Travel02Screen from "./pages/travel-02-screen";
import ClientDetailScreen from "./pages/client-detail-screen";
import { ImagesScreen } from "./pages/images-screen";

try {
    WebApp.requestFullscreen()
    WebApp.disableVerticalSwipes()
    WebApp.lockOrientation()
    // WebApp.checkHomeScreenStatus((status) => {
    //     try {
    //         if (status !== 'added') {
    //             WebApp.addToHomeScreen()
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })
} catch (error) {
    console.log(error)
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
);
function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/client/:unique_url_id" element={<ClientDetailScreen />} />
                        <Route path="/*" element={<RootLayout />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

function Layout() {
    useEffect(() => {
        WebApp.BackButton.hide()
    })
    return <AnimatingContainer className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
            <Outlet />
            <BottomNav /> 
        </AnimatingContainer>
}

function RootLayout() {
    const navigate = useNavigate()
    const {isLoading, data, isError, error} = useUserData()
    const [isInitDataPosted, setIsInitDataPosted] = useState(false)
    useEffect(() => {
         if (data && (!data?.participation_goal || !data.role_in_business || !data.yearly_income || !data.business_domain)) {
            navigate('/onboarding', {
                replace: true
            })
            return;
        }
        if (WebApp.initDataUnsafe.start_param === 'landing') {
            navigate('/club-landing')
        }
    }, [data])

    const postInitData = async () => {
        fetch('https://rasult22.pockethost.io/api/collections/init_data/records', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "init_data": WebApp.initData,
                "init_data_unsafe": WebApp.initDataUnsafe
            })
        })
    }
    useEffect(() => {
        if (isInitDataPosted) {
            return
        }
        setIsInitDataPosted(true)
        postInitData()
    }, [isInitDataPosted, setIsInitDataPosted])

    if (isLoading) {
        return <FullScreenLoader />
    }
    if (isError) {
        return <div className="h-dvh flex items-center justify-center">
            <div className="text-center">
                <Button onClick={postInitData}>Отправить данные об ошибке</Button>
                <p className="text-2xl font-semibold text-text-primary">Ошибка загрузки</p>
                <p className="text-md text-text-error-primary mt-2">{error?.message}</p>
                <p className="text-md text-text-error-primary mt-2">Пожалуйста обратитесь в <a href="https://t.me/margulansupport" className="text-blue-500 underline">службу поддержки</a></p>
            </div>
        </div>
    }
    if (!data?.payment_status) {
        return <div className="flex h-dvh flex-col items-center justify-center text-primary">
            <div>Вы еще не оплатили билет</div>
            <div>Считаете, что это ошибка?</div>
            <div>Пожалуйста обратитесь в <a href="https://t.me/margulansupport" className="text-blue-500 underline">службу поддержки</a></div>
        </div>
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/app/networking" element={<NetworkingScreen />} />
                <Route path="/images" element={<ImagesScreen />} />
                <Route path="/app/ai-video" element={<AIVideoScreen />} />
                <Route path="/app/mk" element={<MkScreen />} />
            </Route>
            <Route path="/chat-test" element={<ChatTestScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/voting" element={<VotingScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/mk-call" element={<MkCallScreen />} />
            <Route path="/ticket" element={<TicketScreen />} />
            <Route path="/tutorial" element={<TutorialScreen />} />
            <Route path="/travel-1" element={<Travel01Screen />} />
            <Route path="/travel-2" element={<Travel02Screen />} />
            <Route path="/create-video" element={<CreateVideoScreen />} />
            <Route path="/ai-diagnostics" element={<AIDiagnosticsScreen />} />
            <Route path="/ai-diagnostics-result" element={<AIDiagnosticsResultScreen />} />
            <Route path="/create-video-result" element={<CreateVideoResultScreen />} />
            <Route path="/face-verification" element={<FaceVerificationScreen />} />
            <Route path="/club-landing" element={<ClubLandingScreen />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}