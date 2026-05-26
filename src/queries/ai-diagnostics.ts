import { PROTOTYPE_MODE } from "@/prototype"
import * as MockQueries from "@/prototype/mock-queries"

async function _getResultsReal(data: any) {
  const response = await fetch('https://t6qiwedpm4et5lmceniaa3v5x40qcllw.lambda-url.eu-north-1.on.aws/', {
    method: 'POST',
    headers: {
      'x-api-key': 'liverpool-is-champ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({data: data})
  })
  if (response.ok) {
    const responseData:AiDiagnosticsResult = await response.json()
    console.log(responseData)
    return responseData
  } else {
    throw new Error('Failed to fetch AI diagnostics results')
  }
}

export const getResults = PROTOTYPE_MODE ? MockQueries.getResults : _getResultsReal;
export type AiDiagnosticsResult = {
  maturity_level: {
    title: string,
    description: string
  },
  short_desc_of_current_state: {
    title: string,
    description: string
  },
  short_swot_analysis: {
    title: string,
    description: string
  },
  strategy_recommendation: {
    title: string,
    description: string
  },
}