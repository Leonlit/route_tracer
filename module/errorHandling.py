class RequestError:
    def __init__(self, errorType, message):
        self.type = errorType
        self.message = message

    def getResponse(self):
        return {
            "status": self.type,
            "message": self.message
        }

class RequestType:
    success = RequestError(200, "Success")
    invalidParameter = RequestError(400, "Invalid Parameter")
    invalidIP = RequestError(422, "Invalid IP address")
    rateLimitReach = RequestError(429, "API limit reached")
    internalError = RequestError(500, "Failed to trace route, please try again later")
    serviceUnavailable = RequestError(503, "Unable to handle request, please try again later")
