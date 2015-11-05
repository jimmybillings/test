	
export function AuthTokenInterceptor(SessionService) {
	'ngInject';
	function requestInterceptor(request) {
		// console.log request
		if(request.url.indexOf('api') !== -1 && SessionService.getLoggedIn()) {
			request.headers.Authorization = 'Bearer ' + SessionService.getToken();
		}
		return request;
	}

	return {
		request: requestInterceptor
	};
}

