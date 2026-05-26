import AnimatingContainer from "@/components/animating-container";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { useClientDetail } from "@/queries/clients";
import { formatFullname } from "@/utils/format-fullname";
import WebApp from "@twa-dev/sdk";
import { useParams } from "react-router";

const ClientDetailScreen = () => {
  const { unique_url_id } = useParams<{ unique_url_id: string }>();
  const {
    isLoading,
    data: client,
    isError,
  } = useClientDetail(unique_url_id || "");

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center text-primary">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="flex h-dvh items-center justify-center text-primary">
        <div>Клиент не найден</div>
      </div>
    );
  }

  return (
    <AnimatingContainer
      className="flex h-dvh flex-col text-primary px-4"
      style={{
        paddingTop: WebApp.safeAreaInset.top + 36,
        paddingBottom: WebApp.safeAreaInset.bottom,
      }}
    >
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col items-center mt-8">
          <Avatar size="2xl" />
          <div className="font-semibold text-[18px] leading-[28px] mt-4">
            {formatFullname(client.fullname)}
          </div>
          {client.is_active ? (
            <Badge color="success" size="sm" className="mt-2">
              Активен
            </Badge>
          ) : (
            <Badge color="gray" size="sm" className="mt-2">
              Неактивен
            </Badge>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <InfoRow label="Стол" value={`№${client.table}`} />
        </div>
      </div>
    </AnimatingContainer>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-bg-tertiary p-4 rounded-[16px]">
    <div className="text-text-tertiary text-[14px] leading-[20px]">{label}</div>
    <div className="font-semibold mt-1">{value}</div>
  </div>
);

export default ClientDetailScreen;
