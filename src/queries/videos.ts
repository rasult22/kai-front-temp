export const setPublic = async (record_id: string, value: boolean) => {
  const data = new FormData()
  data.append('public', value ? 'true' : 'false')
  fetch(`https://rasult22.pockethost.io/api/collections/kai_videos/records/${record_id}`, {
    method: "PATCH",
    body: data
  })
}

export const createVideoRecord = async (payload: {
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