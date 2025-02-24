declare namespace google {
	namespace accounts {
		namespace oauth2 {
			interface TokenClient {
				requestAccessToken(): void;
				callback: (response: { error?: string }) => void;
			}
			function initTokenClient(config: {
				client_id: string;
				scope: string;
				callback: (response: { error?: string }) => void;
			}): TokenClient;
		}
	}
}
declare const gapi: {
	load(api: string, callback: () => void): void;
	client: {
		init(config: { apiKey: string; discoveryDocs: string[] }): Promise<void>;
		drive: {
			files: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				create(params: any): Promise<any>;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				update(params: any): Promise<any>;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				get(params: any): Promise<any>;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				list(params: any): Promise<any>;
			};
		};
	};
};
