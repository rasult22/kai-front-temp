import AnimatingContainer from "@/components/animating-container";
import WebApp from "@twa-dev/sdk";
import { ArrowUpRight } from "@untitledui/icons";

export const ImagesScreen = () => {
    return (
        <AnimatingContainer className="flex-1 flex flex-col overflow-auto px-4 pb-8">
            <div className="text-[24px] leading-[32px] font-semibold">Фотографии со слета </div>

            {/* day 1 */}
            <div onClick={() => {
                WebApp.openLink('https://kazhkenov.wfolio.pro/disk/kaizen-khxbpf/1')
            }} className="active:scale-[0.99] transition-all mt-5">
                <img className="rounded-[16px]" src="//i.wfolio.ru/x/Sjpgrm2v20FR6Cth5viRk6Iir5aoqG4h/ZXWGJmu7EQlhnv6D9ELHSMzGOBuFicXp/OGcM34slpvmXTMkbuJagSV1xA4akZdWt/iGTrK_jx2PJdzPpMyVlbGIyR5mAu9UqG/rL-5DUxboiaoOuXyk54XGcLn0971hhCI/gCh1r1ux0McAqzQsOSm6xAkNGbU6f9Uo/vSTGJQKCXkj0WdfT0czRvVqAYEwXVNfI/2Me5bJBncI1lxPhcXI90BcdH-S0u4kml/zHWOZMnnGOUiIexuTAchr71ZoMXMPp9E/5YGTuAclRD2-WW3vBe0avWpeFPq0zhlW/ld8vU6MfY0kVbRTQ43PEG87OT3p7NMn-/2n0GzK32BPm_4p8zBID9laC-HadxPs11/o3SfK9xrUkxk1TdXdlGFiPjyBV129H9y/J_Jhu1PC9YtGLUa7sluZsSCRBqFKf2TE/NBpm5FCswSIQei3hGK6UxQS0QhA2zaOs/M-2yQ8pEDdlXjV64B3ZU6VTDYIEa18dl/Q59xXlScbyXSOQT2KDbFPfxfnBHFpRUm/MZcyARoJcTo.jpg" alt="" />
                <div className="flex justify-between items-center mt-4">
                    <div className="text-[18px] leading-[28px] font-semibold">
                        1 День
                    </div>
                    <ArrowUpRight className="text-fg-quaternary" size={24}/>
                </div>
            </div>
            {/* day 2 */}
            <div onClick={() => {
                WebApp.openLink('https://kazhkenov.wfolio.pro/disk/kaizen-khxbpf/2')
            }} className="active:scale-[0.99] transition-all mt-4">
                <img className="rounded-[16px]" src="https://i.wfolio.ru/x/Sjpgrm2v20FR6Cth5viRk6Iir5aoqG4h/ZXWGJmu7EQlhnv6D9ELHSMzGOBuFicXp/OGcM34slpvmXTMkbuJagSV1xA4akZdWt/iGTrK_jx2PJdzPpMyVlbGIyR5mAu9UqG/rL-5DUxboiaoOuXyk54XGcLn0971hhCI/gCh1r1ux0McAqzQsOSm6xAkNGbU6f9Uo/vSTGJQKCXkj0WdfT0czRvVqAYEwXVNfI/2Me5bJBncI1lxPhcXI90BcdH-S0u4kml/zHWOZMnnGOUiIexuTAchr8IKGc8Tanzd/2bQQbO1sIclPPFoyvZ8CAtEWSI8x0KLT/8zSNvqecpo0hbvjSh7eoSVbqRFOPwGPh/mfF7vW3ImhVhaNX4hxJye0HKrGqb2IhR/8SxSYj6YNKXtoPei_tOye-5s0RWDpWUG/1_6QGgbNWBGmGsHOIxEDkEdCdHXZuBpE/A5pQBLK3VcCj6oFYWD5UkFmqdV_Kc-am/QO2-1h7WKhFBl3AyoNjsmIRPYXG4MMF3/Tu3ltCTtP5iUU61QxkA3Vq0CsNkSyQ_t/vIRA_SGfpys.jpg" alt="" />
                <div className="flex justify-between items-center mt-4">
                    <div className="text-[18px] leading-[28px] font-semibold">
                        2 День
                    </div>
                    <ArrowUpRight className="text-fg-quaternary" size={24}/>
                </div>
            </div>
            {/* day 3 */}
            <div onClick={() => {
                // WebApp.openLink('https://kazhkenov.wfolio.pro/disk/kaizen-khxbpf/3')
            }} className="active:scale-[0.99] transition-all mt-4">
                <div className="aspect-[16/9] bg-fg-quaternary rounded-[16px] flex items-center justify-center">
                    <div className="uppercase font-bold text-text-secondary">
                        Coming Soon
                    </div>
                </div>
                {/* <img className="rounded-[16px]" src="https://i.wfolio.ru/x/Sjpgrm2v20FR6Cth5viRk6Iir5aoqG4h/ZXWGJmu7EQlhnv6D9ELHSMzGOBuFicXp/OGcM34slpvmXTMkbuJagSV1xA4akZdWt/iGTrK_jx2PJdzPpMyVlbGIyR5mAu9UqG/rL-5DUxboiaoOuXyk54XGcLn0971hhCI/gCh1r1ux0McAqzQsOSm6xAkNGbU6f9Uo/vSTGJQKCXkj0WdfT0czRvVqAYEwXVNfI/2Me5bJBncI1lxPhcXI90BcdH-S0u4kml/zHWOZMnnGOUiIexuTAchrzLnNXIb5ceo/an8--EjjOnBUEIRNOPuohPZw3w3XaH8Y/0kAZZ1n42tFB93SJW2kLvzy5UAQzFZlV/hPFYphZGmEvHjmhzZieJZftG8U0_bv2Z/fZzQY9cVNS-eh71PC8k2vafn2o_niNLk/uasPHXObCjMALhaY6D63SV52hM_2L-sf/vI4weIk_wgQQ95O11dhRO-hrW-3caMJr/xU_T3CiusVCwNiTvsshNSnH_g9o8CRtp/LygRzkpaXoofliCfBT87u8c3ICUlOmMU/8EeqZSIwMOg.jpg" alt="" /> */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-[18px] leading-[28px] font-semibold">
                        3 День
                    </div>
                    <ArrowUpRight className="text-fg-quaternary" size={24}/>
                </div>
            </div>
        </AnimatingContainer>
    );
};
