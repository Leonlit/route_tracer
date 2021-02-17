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
    invalidIP = RequestError(422, "Invalid IP address")
    invalidParameter = RequestError(422, "Invalid Parameter")
    success = RequestError(200, "Success")