import type { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { payloadCmsApiRequest } from '../../helpers/GenericFunctions';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export class PayloadCms implements INodeType {
	description: INodeTypeDescription = {
		name: 'payloadCms',
		displayName: 'Payload CMS',
		icon: 'file:payloadcms.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume the Payload CMS REST API',
		defaults: {
			name: 'Payload CMS',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'payloadCmsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Collection',
						value: 'collection',
					},
				],
				default: 'collection',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['collection'],
					},
				},
				options: [
					{ name: 'Create', value: 'create', action: 'Create a collection entry' },
					{ name: 'Delete', value: 'delete', action: 'Delete a collection entry' },
					{ name: 'Get', value: 'get', action: 'Get a collection entry' },
					{ name: 'Get Many', value: 'getAll', action: 'Get many collection entries' },
					{ name: 'Update', value: 'update', action: 'Update a collection entry' },
				],
				default: 'getAll',
			},
			{
				displayName: 'Collection Slug',
				name: 'collectionSlug',
				description: 'Slug of the collection as configured in Payload',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['collection'],
					},
				},
				default: '',
			},
			{
				displayName: 'Entry ID',
				name: 'entryId',
				description: 'The ID of the document',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['collection'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
			},
			{
				displayName: 'JSON Data',
				name: 'jsonData',
				description: 'Data for create/update operations (JSON format)',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: '{}',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				placeholder: '100',
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'collection') {
				const collectionSlug = this.getNodeParameter('collectionSlug', i) as string;
				let endpoint = `/${collectionSlug}`;
				let method: HttpMethod = 'GET';
				let body: Record<string, unknown> = {};
				let qs: Record<string, unknown> = {};

				switch (operation) {
					case 'create':
						method = 'POST';
						body = this.getNodeParameter('jsonData', i, {}) as Record<string, unknown>;
						break;
					case 'get':
						endpoint += `/${this.getNodeParameter('entryId', i)}`;
						break;
					case 'update':
						method = 'PATCH';
						endpoint += `/${this.getNodeParameter('entryId', i)}`;
						body = this.getNodeParameter('jsonData', i, {}) as Record<string, unknown>;
						break;
					case 'delete':
						method = 'DELETE';
						endpoint += `/${this.getNodeParameter('entryId', i)}`;
						break;
					case 'getAll':
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (!returnAll) {
							qs.limit = this.getNodeParameter('limit', i);
						}
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation ${operation}`);
				}

                                const responseData = await payloadCmsApiRequest.call(
                                        this,
                                        method,
                                        endpoint,
                                        collectionSlug,
                                        body,
                                        qs,
                                );

				if (Array.isArray((responseData as any)?.docs)) {
					returnData.push(...(responseData as any).docs.map((d: any) => ({ json: d })));
				} else if (responseData) {
					returnData.push({ json: responseData });
				}
			}
		}

		return [returnData];
	}
}
