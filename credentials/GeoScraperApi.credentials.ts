import type {
	IAuthenticateGeneric,
	ICredentialType,
	ICredentialTestRequest,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class GeoScraperApi implements ICredentialType {
	name = 'geoScraperApi';
	displayName = 'GeoScraper API';
	icon = 'file:GeoScraperGoogleMap.svg' as Icon;
	documentationUrl = 'https://docs.geoscraper.net/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			placeholder: 'Your GeoScraper API token',
			required: true,
			noDataExpression: true,
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Berserker-Token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://api.geoscraper.net/test-api-key',
			headers: {
				'X-Berserker-Token': '={{$credentials.apiToken}}',
				'Authorization': 'Bearer {{$credentials.apiToken}}',
			},
		},
	};
}
