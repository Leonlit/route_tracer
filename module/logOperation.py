import logging, pathlib, os

if not os.path.exists('assets/logs'):
    os.makedirs('assets/logs')
logFilePath = pathlib.Path().absolute()

class CustomLogger:
    def __init__(self):
        # Create a custom logger
        self.logger = logging.getLogger(__name__)
        # Create handlers
        c_handler = logging.FileHandler(f'{logFilePath}/assets/logs/operation.log')
        f_handler = logging.FileHandler(f'{logFilePath}/assets/logs/error.log')
        s_handler = logging.FileHandler(f'{logFilePath}/assets/logs/critical.log')
        c_handler.setLevel(logging.INFO)
        f_handler.setLevel(logging.ERROR)
        s_handler.setLevel(logging.CRITICAL)

        # Create formatters and add it to handlers
        loggerFormat = logging.Formatter('[%(asctime)s]# > %(message)s')
        c_handler.setFormatter(loggerFormat)
        f_handler.setFormatter(loggerFormat)
        s_handler.setFormatter(loggerFormat)

        # Add handlers to the logger
        self.logger.addHandler(c_handler)
        self.logger.addHandler(s_handler)
        self.logger.addHandler(f_handler)

    def operationLog(self, message):
        self.logger.info(message)

    def errorLog(self, message):
        self.logger.error(message)

    def criticalLog(self, message):
        self.logger.critical(message)