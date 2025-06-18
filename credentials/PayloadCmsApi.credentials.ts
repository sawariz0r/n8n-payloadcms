import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PayloadCmsApi implements ICredentialType {
	name = 'payloadCmsApi';
	displayName = 'Payload CMS API';
	documentationUrl = 'https://payloadcms.com/docs/authentication/api-keys';
	dummy = false;
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			description: 'Root URL of your Payload installation, e.g. https://cms.example.com',
			type: 'string',
			default: '',
			placeholder: 'https://cms.example.com',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			description: 'API key created in Payload ➜ Access ➜ API Keys',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
