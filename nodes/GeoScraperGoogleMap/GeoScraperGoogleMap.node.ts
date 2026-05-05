import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class GeoScraperGoogleMap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GeoScraper Google Map Scraper',
		name: 'geoScraperGoogleMap',
		icon: 'file:GeoScraperGoogleMap.svg',
		group: ['transform'],
		version: 1,
		description: 'Unified node for GeoScraper Google Map Scraper operations',
		defaults: {
			name: 'GeoScraper Google Map Scraper',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		requestDefaults: {
			baseURL: 'https://api.geoscraper.net',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		credentials: [
			{
				name: 'geoScraperApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Map Search', value: 'mapSearch', action: 'Scrape google map search results', description: 'Scrape Google Map search results' },
					{ name: 'Place Search', value: 'placeSearch', action: 'Scrape google map place search results', description: 'Scrape Google Map place search results' },
					{ name: 'Single Place', value: 'singlePlace', action: 'Get details for a single place', description: 'Get details for a single place' },
					{ name: 'Review', value: 'review', action: 'Scrape google map reviews', description: 'Scrape Google Map reviews' },
				],
				default: 'mapSearch',
			},
			// Map Search & Place Search
			{
				displayName: 'Location Name or Coordinates',
				name: 'll',
				type: 'string',
				default: '',
				placeholder: 'japan',
				description: 'Location name (for example, "japan") or coordinates in the format "@latitude,longitude,zoomz"',
				displayOptions: {
					show: {
						operation: ['mapSearch', 'placeSearch'],
					},
				},
			},
			// Map Search & Place Search
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				placeholder: 'kfc',
				description: 'The search query, for example "kfc"',
				displayOptions: {
					show: {
						operation: ['mapSearch', 'placeSearch'],
					},
				},
			},
			// Map Search only
			{
				displayName: 'Pagination Index',
				name: 'start',
				type: 'number',
				default: 0,
				placeholder: '0',
				description: 'Pagination index of the results',
				displayOptions: {
					show: {
						operation: ['mapSearch'],
					},
				},
			},
			// Single Place
			{
				displayName: 'ID Type',
				name: 'idType',
				type: 'options',
				options: [
					{ name: 'Data ID', value: 'data_id' },
					{ name: 'Place ID', value: 'place_id' },
				],
				default: 'data_id',
				description: 'Choose whether to use data_id or place_id',
				displayOptions: {
					show: {
						operation: ['singlePlace'],
					},
				},
			},
			{
				displayName: 'Data ID',
				name: 'data_id',
				type: 'string',
				default: '',
				placeholder: 'data_id',
				description: 'The unique identifier for the place (data_id)',
				displayOptions: {
					show: {
						operation: ['singlePlace'],
						idType: ['data_id'],
					},
				},
			},
			{
				displayName: 'Place ID',
				name: 'place_id',
				type: 'string',
				default: '',
				placeholder: 'ChIJ4frOVXpXKSsRFvGE8-3qe4k',
				description: 'The Google Maps place_id for the place',
				displayOptions: {
					show: {
						operation: ['singlePlace'],
						idType: ['place_id'],
					},
				},
			},
			// Review
			{
				displayName: 'Place Data ID',
				name: 'review_data_id',
				type: 'string',
				default: '',
				placeholder: '0x2b29577a55cefae1:0x897beaedf384f116',
				description: 'The unique identifier for the place (data_id)',
				displayOptions: {
					show: {
						operation: ['review'],
					},
				},
			},
			{
				displayName: 'Next Page Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Token for the next page (optional)',
				displayOptions: {
					show: {
						operation: ['review'],
					},
				},
			},
			// Common
			{
				displayName: 'Language',
				name: 'hl',
				type: 'string',
				default: 'en',
				placeholder: 'en',
				description: 'Language parameter for response language',
			},
			{
				displayName: 'Use Cached',
				name: 'cached',
				type: 'boolean',
				default: true,
				description: 'Whether to use cached data if available',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const hl = this.getNodeParameter('hl', i, 'en') as string;
				const cached = this.getNodeParameter('cached', i, true) as boolean;

				let endpoint = '';
				let payload: IDataObject = {};

				switch (operation) {
					case 'mapSearch': {
						const ll = this.getNodeParameter('ll', i) as string;
						const query = this.getNodeParameter('query', i) as string;
						const start = this.getNodeParameter('start', i, 0) as number;
						endpoint = '/google/map/results';
						payload = { ll, query };
						if (start !== undefined) payload.start = start;
						break;
					}
					case 'placeSearch': {
						const ll = this.getNodeParameter('ll', i) as string;
						const query = this.getNodeParameter('query', i) as string;
						endpoint = '/google/map/search/place';
						payload = { ll, query };
						break;
					}
					case 'singlePlace': {
						const idType = this.getNodeParameter('idType', i) as string;
						const data_id = this.getNodeParameter('data_id', i, '') as string;
						const place_id = this.getNodeParameter('place_id', i, '') as string;
						endpoint = '/google/map/place';
						if (idType === 'data_id' && data_id) {
							payload.data_id = data_id;
						} else if (idType === 'place_id' && place_id) {
							payload.place_id = place_id;
						} else {
							throw new NodeOperationError(this.getNode(), 'You must provide a value for the selected ID type.', { itemIndex: i });
						}
						break;
					}
					case 'review': {
						const data_id = this.getNodeParameter('review_data_id', i) as string;
						const token = this.getNodeParameter('token', i, '') as string;
						endpoint = '/google/map/review';
						payload = { data_id };
						if (token) payload.token = token;
						break;
					}
					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
				}

				if (hl) payload.hl = hl;
				if (cached !== undefined) payload.cached = cached;

				const data = await this.helpers.requestWithAuthentication.call(this, 'geoScraperApi', {
					method: 'POST',
					baseURL: 'https://api.geoscraper.net',
					url: endpoint,
					body: payload,
					json: true,
				});

				if (Array.isArray(data)) {
					for (const result of data) {
						returnData.push({ json: result });
					}
				} else {
					returnData.push({ json: data });
				}
			} catch (error: unknown) {
				const requestError = error as {
					message?: string;
					statusCode?: number;
					response?: { status?: number; data?: IDataObject };
					error?: { detail?: string };
				};
				const statusCode = requestError.statusCode ?? requestError.response?.status;
				const detail = (requestError.error?.detail ??
					(requestError.response?.data?.detail as string | undefined)) as string | undefined;

				if (
					statusCode === 404 &&
					detail === 'No data found'
				) {
					returnData.push({ json: { message: 'No more results', detail: 'No data found' }, pairedItem: i });
					continue;
				}
				if (this.continueOnFail()) {
					returnData.push({ json: { error: requestError.message ?? 'Request failed' }, pairedItem: i });
				} else {
					throw new NodeOperationError(
						this.getNode(),
						requestError.message ?? 'Request failed',
						{ itemIndex: i },
					);
				}
			}
		}
		return [returnData];
	}
}
