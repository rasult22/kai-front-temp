import { PROTOTYPE_MODE } from "@/prototype"
import * as MockQueries from "@/prototype/mock-queries"

const _setPublicReal = async (record_id: string, value: boolean) => {
  const data = new FormData()
  data.append('public', value ? 'true' : 'false')
  fetch(`https://rasult22.pockethost.io/api/collections/kai_videos/records/${record_id}`, {
    method: "PATCH",
    body: data
  })
}

export const setPublic = PROTOTYPE_MODE ? MockQueries.setPublic : _setPublicReal;

const _createVideoRecordReal = async (payload: {
  "user": any,
  "tg_id": string | number,
  "video_url": string,
  "video_thumbnail": string,
  "date": string,
  "public": boolean,
  "style_name": string
}) => {
  const record: any = await fetch('https://rasult22.pockethost.io/api/collections/kai_videos/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    }).then(x => x.json())
  return record
}

export const createVideoRecord = PROTOTYPE_MODE ? MockQueries.createVideoRecord : _createVideoRecordReal;