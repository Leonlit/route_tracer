### scripts flow

1. get domain name from user (input field html)
2. get the route to the specified domain name (use os.system() from python os module)
3. When getting the routes, filters the result to remove excessive info
4. save the route into text file for caching purpose
5. check IP info using API
6. construct a new dictionary using the IP info (lat, long, etc) along with the ip address
7. simulating route to the identfied location using any web framework in python.
8. store the data in json form into local storage as history.


### todo

- construct code for traceroute command:
    - ~window~
    - ~linux~
    - mac ?
- test traceroute command:
    - ~window~
    - linux
    - mac ?
- error handling
- error logging using logging library from python
- map integration
- map drawing with route line
- spam prevention
- saving data in local storage as history
- filtering the output from tracert/traceroute
- using powershell to filter 
- more simple way to import libraries