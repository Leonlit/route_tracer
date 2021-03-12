import logging, pathlib, os

if not os.path.exists('assets/logs'):
    os.makedirs('assets/logs')
logFilePath = pathlib.Path().absolute()

def loggingInit(filename):
    # Create a custom logger
    loggerInfo = logging.getLogger("routeInfo")

    logging.basicConfig(filename=f'{logFilePath}/assets/logs/{filename}.log',
    format='[%(asctime)s]# (%(levelname)s) > %(message)s',
    filemode='a')

    loggerInfo.setLevel(logging.INFO)
    return loggerInfo