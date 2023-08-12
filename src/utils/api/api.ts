export type ReqMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';

class Api {
	private baseFetch<T>(url: string, options?: RequestInit): Promise<T> {
		return fetch(url, options).then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json() as Promise<T>;
		});
	}

	get<T>(endpoint: string): Promise<T> {
		return this.baseFetch(endpoint);
	}

	post<T>(endpoint: string, body: T): Promise<T>;
	post<T, R>(endpoint: string, body: T): Promise<R>;
	post<T, R>(endpoint: string, body: T): Promise<R> {
		return this.baseFetch(endpoint, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	put<T>(endpoint: string, body: T): Promise<T>;
	put<T, R>(endpoint: string, body: T): Promise<R>;
	put<T, R>(endpoint: string, body: T): Promise<R> {
		return this.baseFetch(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	delete<T>(endpoint: string): Promise<T> {
		return this.baseFetch(endpoint, {
			method: 'DELETE'
		});
	}
}

export const api = new Api();
