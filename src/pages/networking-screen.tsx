import AnimatingContainer from "@/components/animating-container";
import { Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { connectWithUser, NetwokingUser, useConnectedList, useNetworkingList } from "@/queries/networking";
import { formatFullname } from "@/utils/format-fullname";
import WebApp from "@twa-dev/sdk";
import { MessageTextSquare01, Send01, Users03, XClose } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Key } from "react-aria-components";

const tabs = [
  { id: "recommend", label: "Рекомендации" },
  { id: "contacts", label: "Контакты" },
];

export const NetworkingScreen = () => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<Key>("recommend");
    const [cardData, setCardData] = useState<NetwokingUser | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const {isLoading, data: netwokingList} = useNetworkingList()
    const {isLoading: isConnectedListLoading, data: connectedList, refetch: refetchConnectedList} = useConnectedList()
    
    const onCardClick = (card: NetwokingUser) => {
        WebApp.HapticFeedback.impactOccurred('medium')
        setCardData(card);
    }
    const onButtonClick = (username: string) => {
        WebApp.HapticFeedback.impactOccurred('medium')
        if (username) {
            WebApp.openTelegramLink("https://t.me/" + username.replace(/^@/, ""))
        }
    }
    
    const handleSkipCard = () => {
        WebApp.HapticFeedback.impactOccurred('medium')
        setCurrentCardIndex(prev => prev + 1);
    }

    const handleConnectCard = async (card: NetwokingUser) => {
        WebApp.HapticFeedback.impactOccurred('medium')
        // Здесь можно добавить логику для связи с пользователем
        setCurrentCardIndex(prev => prev + 1);
        if (card.username) {
            WebApp.openTelegramLink("https://t.me/" + card.username.replace(/^@/, ""))
        }
        await connectWithUser(card.id)
        refetchConnectedList()
    }
    if (isLoading || isConnectedListLoading) {
        return <div className="flex-1 flex flex-col overflow-auto text-center justify-center">Loading...</div>
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <div className="border-b border-border-secondary px-4 pt-4">
                <Tabs
                    selectedKey={selectedTabIndex}
                    onSelectionChange={(key) => {
                    WebApp.HapticFeedback.impactOccurred('medium')
                    setSelectedTabIndex(key)
                    }}
                    className="w-full"
                >
                    <Tabs.List className="before:h-0" type="underline" fullWidth items={tabs}>
                    {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>
                </Tabs>
            </div>
            {
                selectedTabIndex === "recommend" && netwokingList &&
                <AnimatingContainer className="p-4 flex-1 flex flex-col">
                    <div className="relative flex-1">
                        <AnimatePresence mode="popLayout">
                            {netwokingList?.slice(currentCardIndex, currentCardIndex + 3).map((card, index) => (
                                <SuggestionCard 
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    isTop={index === 0}
                                    onSkip={handleSkipCard}
                                    onConnect={() => handleConnectCard(card)}
                                />
                            ))}
                        </AnimatePresence>
                        {currentCardIndex >= netwokingList.length && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-text-tertiary text-lg">Больше карточек нет</div>
                                    <div className="text-text-quaternary text-sm mt-2">Попробуйте позже</div>
                                </div>
                            </div>
                        )}
                    </div>
                </AnimatingContainer>
            }
            {
                selectedTabIndex === "contacts" && 
                <AnimatingContainer className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2">
                        <Users03 className="text-border-brand"/>
                        <div>
                            Вы связывались
                        </div>
                    </div>
                    <div className="text-[14px] leading-[20px] text-text-tertiary mt-4">Всего контактов: {connectedList?.count}</div>
                    <div className="mt-4 flex flex-col gap-2">
                        {connectedList && connectedList.results.map(card => {
                            return <ContactCard key={card.id} onButtonClick={() => onButtonClick(card.username)} onCardClick={() => onCardClick(card)} card={card}/>
                        })}
                     
                    </div>
                </AnimatingContainer>
            }
            <AnimatePresence>
                { 
                    cardData && 
                    <BottomSheet card={cardData} onClose={() => {
                        WebApp.HapticFeedback.impactOccurred('medium')
                        setCardData(null)
                    }}/>
                }
            </AnimatePresence>
        </div>
    );
};


const SuggestionCard = ({ 
    card, 
    index, 
    isTop, 
    onSkip, 
    onConnect 
}: { 
    card: NetwokingUser;
    index: number;
    isTop: boolean;
    onSkip: () => void;
    onConnect: () => void;
}) => {
    const zIndex = 10 - index;
    const scale = 1 - (index * 0.05);
    const yOffset = index * 8;
    
    return (
        <motion.div 
            initial={{ 
                x: 0, 
                opacity: 1,
                scale: scale,
                y: yOffset,
                zIndex: zIndex
            }}
            animate={{ 
                scale: scale,
                y: yOffset,
                zIndex: zIndex
            }}
            exit={{ 
                x: "-100%", 
                opacity: 0,
                zIndex: 20, // Увеличиваем z-index при выходе
                transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.4 
                }
            }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30
            }}
            className={`absolute inset-0 bg-bg-active text-primary border-border-secondary p-4 rounded-[16px] flex flex-col items-center ${
                !isTop ? 'pointer-events-none' : ''
            }`}
            style={{
                zIndex: zIndex
            }}
        >
            <Avatar src={card.photo_url} size="2xl" />
            <div className="font-semibold text-[18px] leading-[28px] mt-4">{formatFullname(card.fullname)}</div>
            <div className="text-text-brand-secondary">{card.role_in_business}</div>
            <div className="text-text-tertiary mt-2">
                {card.business_domain}
            </div>
            <div className="font-semibold mt-4 text-text-tertiary">Цель участия:</div>
            <div className="text-center mt-3 text-text-tertiary">
                {card.participation_goal}
            </div>
            <div className="mt-auto flex flex-col w-full gap-3">
                <Button 
                    className="w-full" 
                    size="xl" 
                    iconLeading={<MessageTextSquare01 size={20} className="text-button-primary-icon" />}
                    onClick={onConnect}
                    isDisabled={!isTop}
                >
                    Связаться
                </Button>
                <Button 
                    className="w-full" 
                    size="xl" 
                    color="secondary" 
                    iconLeading={<XClose size={20} className="text-fg-quaternary" />}
                    onClick={onSkip}
                    isDisabled={!isTop}
                >
                    Пропустить
                </Button>
            </div>
        </motion.div>
    )
}

const ContactCard = ({onButtonClick, onCardClick, card}: {card: NetwokingUser, onButtonClick: (e: React.MouseEvent) => void, onCardClick: (e: React.MouseEvent) => void}) => {
  

    return (
        <div 
            className="flex active:bg-bg-secondary_alt transition-all items-center gap-2 bg-bg-tertiary p-4 rounded-[16px] cursor-pointer"
            onClick={onCardClick}
        >
            <Avatar src={card.photo_url} size="md" />
            <div>
                <div className="font-semibold text-[14px] leading-[20px]">{formatFullname(card.fullname)}</div>
                <div className="text-text-brand-secondary text-[14px] leading-[20px]">{card.role_in_business}</div>
            </div>
            <ButtonUtility 
                className="ml-auto active:bg-bg-primary" 
                color="tertiary" 
                icon={<Send01 />} 
                onClick={onButtonClick}
            />
        </div>
    );
}

const BottomSheet = ({onClose, card}: {onClose: () => void, card: NetwokingUser}) => {
    return <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex flex-col justify-end">
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-bg-secondary relative px-6 h-[60vh] py-8 border-t flex flex-col items-center border-border-secondary rounded-t-[20px]">
            <ButtonUtility onClick={onClose} className="absolute right-6 top-6" color="tertiary" icon={<XClose />}/>
            <Avatar src={card.photo_url} size="2xl" />
            <div className="font-semibold text-[18px] leading-[28px] mt-4">{formatFullname(card.fullname)}</div>
            <div className="text-text-brand-secondary">{card.role_in_business}</div>
            <div className="text-text-tertiary mt-2">
                {card.business_domain}
            </div>
            <div className="font-semibold mt-4 text-text-tertiary">Цель участия:</div>
            <div className="text-center mt-3 text-text-tertiary">
                {card.participation_goal}
            </div>
            <div className="mt-auto flex flex-col w-full gap-3">
                <Button onClick={() => {
                    WebApp.openTelegramLink(`https://t.me/${card.username}`)
                }} className="w-full" size="xl" iconLeading={<MessageTextSquare01 size={20} className="text-button-primary-icon" />}>Связаться</Button>
            </div>
        </motion.div>
    </motion.div>
}
