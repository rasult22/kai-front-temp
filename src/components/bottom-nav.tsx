import WebApp from "@twa-dev/sdk";
import { Home01, Image03, Star06, Users03 } from "@untitledui/icons";
import { useLocation, useNavigate } from "react-router";
import { Avatar } from "./base/avatar/avatar";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  return (
    <div className="p-1 flex border-t-1 border-border-tertiary text-[12px] leading-[18px]">
      <div
        onClick={() =>{
          WebApp.HapticFeedback.impactOccurred('medium')
          navigate("/", {
            replace: true,
          })
        }
        }
        className="w-full flex flex-col items-center py-2"
      >
        <Home01 color={(currentPath === "/") ? "#EA620C" : "#6B7280"} />
        <div
          className={`${currentPath === "/" ? "text-[#EA620C] dark:text-white" : "text-gray-500"} font-medium mt-1`}
        >
          Главная
        </div>
      </div>
      <div
        onClick={() =>{
          WebApp.HapticFeedback.impactOccurred('medium')
          navigate("/images", {
            replace: true,
          })
        }
        }
        className="w-full flex flex-col items-center py-2"
      >
        <Image03 color={(currentPath === "/images") ? "#EA620C" : "#6B7280"} />
        <div
          className={`${currentPath === "/images" ? "text-[#EA620C] dark:text-white" : "text-gray-500"} font-medium mt-1`}
        >
          Фото
        </div>
      </div>
      <div
        onClick={() =>{
            WebApp.HapticFeedback.impactOccurred('medium')
            navigate("/app/networking", {
              replace: true,
            })
          }
        }
        className="w-full flex flex-col items-center py-2"
      >
        <Users03
          color={currentPath === "/app/networking" ? "#EA620C" : "#6B7280"}
        />
        <div
          className={`${currentPath === "/app/networking" ? "text-[#7F56D9] dark:text-white" : "text-gray-500"} font-medium mt-1`}
        >
          Нетворкинг
        </div>
      </div>
      <div
        onClick={() =>{
            WebApp.HapticFeedback.impactOccurred('medium')
            navigate("/app/mk", {
              replace: true,
            })
          }
        }
        className="w-full flex flex-col items-center py-2"
      >
        <Avatar size="xs" src="/mk.png" />
        <div
          className={`${currentPath === "/app/mk" ? "text-[#7F56D9] dark:text-white" : "text-gray-500"} font-medium mt-1`}
        >
          AI MK
        </div>
      </div>
      <div
        onClick={() =>{
            WebApp.HapticFeedback.impactOccurred('medium')
            navigate("/app/ai-video", {
              replace: true,
            })
          }
        }
        className="w-full flex flex-col items-center py-2"
      >
        <Star06 color={currentPath === "/app/ai-video" ? "#7F56D9" : "#6B7280"} />
        <div
          className={`${currentPath === "/app/ai-video" ? "text-[#7F56D9] dark:text-white" : "text-gray-500"} font-medium mt-1`}
        >
          AI-Видео
        </div>
      </div>
    </div>
  );
}
