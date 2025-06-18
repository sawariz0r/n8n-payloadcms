import type { OptionsWithUri } from 'request';
import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

export async function payloadCmsApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body: object = {},
  qs: object = {},
  headers: Record<string, string | number> = {},
  option: Partial<OptionsWithUri> = {},
) {
  const credentials = await this.getCredentials('payloadCmsApi');
  const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
  const authCollection = credentials.authCollection as string;

  const defaultHeaders = {
    Authorization: `${authCollection} API-Key ${credentials.apiKey}`,
    'Content-Type': 'application/json',
  };

  const options: OptionsWithUri = {
    method,
    qs,
    body,
    uri: `${baseUrl}/api${endpoint}`,
    json: true,
    headers: { ...defaultHeaders, ...headers },
    ...option,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  // @ts-ignore (n8n request helper handles errors & cookies)
  return this.helpers.request(options);
}
