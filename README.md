# Plant Monitor

<img src="https://github.com/crnicholson/Plant-Monitor/blob/main/Media/pcb.png" alt="Glider" width="300"/> | <img src="https://github.com/crnicholson/Plant-Monitor/blob/main/Media/dashboard.png" alt="PCB" width="300"/>
-- | --
<i>Plant Monitor transmitter circuit board.</i> | <i>Web interface login page.</i>

## About

Plant Monitor is a way to view data from a remote humidity sensor on web interface, which then tells you when you need to water your plants plus the air humidity, soil humidity, air temp, and air pressure. These metrics can be combined with AI to predict forest fires. 

## Get Started

Plant Monitor uses Auth0 to securely log into the web interface. No data or passwords is shown to me. 

PCBs:
1. First, order your transmitter PCB and ground PCB from JLCPCB (soon from me).
2. For now, contact me to add a station number and a passcode for the station. At this time, you'll also need to program your WiFi SSID and password to the ground station PCB and the station number to the transmitter PCB.
3. Turn on the transmitter PCB and place it in the soil of a plant you want to monitor. Make sure to not get it wet!
4. Turn on the ground station PCB. This will receive all the data from the transmitter (sensor) and automatically put it on the web.

Web interface:
1. Next, Go to the [web interface](https://plant-monitor-web.vercel.app) and make an account. 
2. Then, add your station number. Remember to add the password of the station when entering the station number. 
3. The data will now be automatically fetched every 5 seconds. 
4. Lastly, interact with the graphs to see your data over time. 

## Need Help?

Do you have any questions? Are the docs incomplete and you want to ask anything? Do you just want to say hi (or how cool my project is!)?

Reach out to me at [charlienicholsonr@gmail.com](mailto:charlienicholsonr@gmail.com).

## Credits

Thanks to Zach Latta for the idea.

## License

Both the software and documentation are under the [GNU GPL v3 license](https://choosealicense.com/licenses/gpl-3.0/). The hardware and the 3D files are under the [CERN Open Hardware Licence Version 2 - Strongly Reciprocal](https://choosealicense.com/licenses/cern-ohl-s-2.0/). The media is under the [CC BY 4.0 DEED](https://creativecommons.org/licenses/by/4.0/).
