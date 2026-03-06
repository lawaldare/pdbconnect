export const ErrorsList = {
  '400': {
    title: 'Bad Request',
    message: "Your request couldn't be understood by the server. Please check and try again.",
  },
  '401': {
    title: 'Unauthorized',
    message: 'You need to log in to access this page. Please sign in and try again.',
  },
  '402': {
    title: 'Payment Required',
    message: 'Payment is required to access this resource.',
  },
  '403': {
    title: 'Forbidden',
    message: "You don't have permission to view this page. Contact the administrator if you believe this is a mistake.",
  },
  '404': {
    title: 'Not Found',
    message: 'We’re sorry – we can’t find the page or file you requested.',
  },
  '405': {
    title: 'Method Not Allowed',
    message: 'This action isn’t allowed on this page.',
  },
  '406': {
    title: 'Not Acceptable',
    message: 'The server can’t respond with a format that matches your request.',
  },
  '407': {
    title: 'Proxy Authentication Required',
    message: 'Authentication is required by the proxy server.',
  },
  '408': {
    title: 'Request Timeout',
    message: 'The server took too long to respond. Please try again later.',
  },
  '409': {
    title: 'Conflict',
    message: 'There’s a conflict with your request. Please refresh or try again.',
  },
  '410': {
    title: 'Gone',
    message: 'This page is no longer available. It may have been removed permanently.',
  },
  '411': {
    title: 'Length Required',
    message: 'The server needs a valid content length header. Please try again.',
  },
  '412': {
    title: 'Precondition Failed',
    message: 'One of the conditions in your request wasn’t met.',
  },
  '413': {
    title: 'Payload Too Large',
    message: 'The file or data you sent is too large. Try reducing the size.',
  },
  '414': {
    title: 'URI Too Long',
    message: 'The URL is too long for the server to handle.',
  },
  '415': {
    title: 'Unsupported Media Type',
    message: 'The server doesn’t support the media type of your request.',
  },
  '416': {
    title: 'Range Not Satisfiable',
    message: 'The range specified in the request cannot be fulfilled.',
  },
  '417': {
    title: 'Expectation Failed',
    message: 'The server couldn’t meet the expectations specified in the request.',
  },
  '418': {
    title: "I'm a teapot",
    message: 'Just a joke from the Hyper Text Coffee Pot Protocol. ☕️',
  },
  '421': {
    title: 'Misdirected Request',
    message: 'The request was sent to the wrong server.',
  },
  '422': {
    title: 'Unprocessable Entity',
    message: 'The server understands the request but can’t process it due to semantic errors.',
  },
  '423': {
    title: 'Locked',
    message: 'The resource is currently locked.',
  },
  '424': {
    title: 'Failed Dependency',
    message: 'A dependent request failed, so this one could not be processed.',
  },
  '425': {
    title: 'Too Early',
    message: 'The server is unwilling to process the request because it might be replayed.',
  },
  '426': {
    title: 'Upgrade Required',
    message: 'Please upgrade your connection to proceed.',
  },
  '428': {
    title: 'Precondition Required',
    message: 'This request needs certain conditions that weren’t met.',
  },
  '429': {
    title: 'Too Many Requests',
    message: 'You’ve sent too many requests in a short time. Please slow down.',
  },
  '431': {
    title: 'Request Header Fields Too Large',
    message: 'The request headers are too large. Try reducing their size.',
  },
  '451': {
    title: 'Unavailable For Legal Reasons',
    message: 'This content isn’t available due to legal restrictions.',
  },
  '500': {
    title: 'Internal Server Error',
    message: 'Something went wrong on our end. We’re working on it.',
  },
  '501': {
    title: 'Not Implemented',
    message: 'The server doesn’t support this functionality.',
  },
  '502': {
    title: 'Bad Gateway',
    message: 'The server received an invalid response. Please try again later.',
  },
  '503': {
    title: 'Service Unavailable',
    message: 'Our service is temporarily unavailable. Please try again shortly.',
  },
  '504': {
    title: 'Gateway Timeout',
    message: 'The server didn’t respond in time. Try refreshing the page.',
  },
  '505': {
    title: 'HTTP Version Not Supported',
    message: 'The server doesn’t support the HTTP version used in the request.',
  },
  '506': {
    title: 'Variant Also Negotiates',
    message: 'Configuration error on the server.',
  },
  '507': {
    title: 'Insufficient Storage',
    message: 'The server can’t store the data needed to process the request.',
  },
  '508': {
    title: 'Loop Detected',
    message: 'The server detected an infinite loop while processing the request.',
  },
  '510': {
    title: 'Not Extended',
    message: 'Further extensions to the request are required.',
  },
  '511': {
    title: 'Network Authentication Required',
    message: 'You must authenticate with the network before proceeding.',
  },
};
