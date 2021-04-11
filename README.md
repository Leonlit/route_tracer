# Route Tracer
Get the information of the node that our packet gone through when reaching to a domain. The website used computer's command tracert (this is in window, if it's in linux the application would use traceroute).

## Tech used

 - Python
 - Flask
 - HTML
 - CSS
 - JS
 - [Leaflet](https://leafletjs.com/)
 - [IPInfo API](https://ipinfo.io/)

## Setup

To setup the project you'll just need to make sure python and pip3 is installed on your machine. Then, clone this repository to a folder that you want on your machine. After that create a virtual environment using [virtualenv](https://pypi.org/project/virtualenv/). Although it's not required, it's recommended to use it.

After you've created a virtual environment for the cloned project, open a terminal in the directory that you've cloned this project to, activate the virtual environment using ```. ./venv/Scripts/activate```. Then execute ```pip3 install -r requirements.txt``` to install all the libraries that the project needs.

## Running the project

Well, setting up the project might be hard, but to run the application, just run ```python server.py```. Which you can then open up the web application on http://127.0.0.1:5000 or http://localhost:5000

## Screenshots 

### Main Page (desktop)
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/main_page.png?raw=true" alt="main page (desktop)" height="350px">

### Tracing Google
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/tracing_google.png?raw=true" alt="Tracing Google" height="350px">

### Selecting a Vertice
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/selecting_vertices.png?raw=true" alt="Selecting a vertice on the map" height="350px">

### Selecting a Edge
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/selecting_edge.png?raw=true" alt="Selecting a edge on the map" height="350px">

### Mobile View
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/mobile_view.png?raw=true" alt="Viewing page in mobile mode" height="350px">

### Tablet View
<img src="https://github.com/Leonlit/route_tracer/blob/main/assets/images/tablet_view.png?raw=true" alt="Viewing page in tablet mode" height="350px">

#### If you found any bugs or suggestion for improvement, feel free to open an issue for the repo.
