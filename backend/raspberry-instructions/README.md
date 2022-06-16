# Instructions for Raspberry Pi configuration for edpiv

Connect your SD Card to your computer

## Install the OS

Download Raspberry Pi Imager: https://www.raspberrypi.org/downloads/ and choose Raspbian (first option)

## Enabling SSH login

- Create empty file named `SSH` at the root of your SD Card.

(More details and instructions on how to do it with monitor using GUI here:
https://linuxize.com/post/how-to-enable-ssh-on-raspberry-pi/#connecting-raspberry-pi-via-ssh)

- Disconnect the SD Card from your computer and put it in the Raspberry and turn it on

## Start the Raspberry with screen, mouse and keyboard
- Check "Use english language"
- Change the password (note it)
- If the screen has black border, check "This screen shows a black border..."
- Connect the wifi
- Update Software : click next
- Remove background image and set it to black
- Open the terminal and type `hostname -I`, note the IP

## Add EDPIV Configuration from your computer

> Your computer must be connected on the same wifi (or connect it via ethernet or USB)

In the following commands :

- Replace `<IP>` with the IP of your Raspberry
- Replace the screen url in the first command 
- `ssh-keygen -R <IP>`
-  `ssh <IP> -l pi "sudo sed -i '/^@chromium/d' /etc/xdg/lxsession/LXDE-pi/autostart; echo '@chromium-browser --kiosk --disable-features=TranslateUI --no-default-browser-check
--no-first-run --disable-infobars --disable-session-crashed-bubble --disable-restore-session-state --disable-plugins --noerrordialogs --force-device-scale-factor=1 --disable-popup-blocking --disable-tab-switcher --disable-translate --check-for-update-interval=31536000 --disable-component-update --incognito https://edpiv.com/?uuid=27becb79-50b7-4c65-8b58-9bdbde28678e&slideshow_id=4' | sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart"`
- `ssh <IP> -l pi "printf '\n@xset s noblank\n@xset s off\n@xset s -dpms\n' | sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart"`

and then run them one by one in the terminal. (the password is the one you choose before)

## Restart you Raspberry when updates are finished

> It should open the EDPIV Screen automatically and fullscreen

----

# Other informations

## Connect to the Raspberry with: 

`ssh pi@raspberrypi.local`

Password: the password you choose before (by default it's `raspberry`)

## Setup WIFI from CLI

`sudo raspi-config` then select `Network Options` > `Wi-fi`
Write the wifi name and password.

More info : https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
From desktop : https://www.raspberrypi.org/documentation/configuration/wireless/desktop.md


## manual config

Add these lines to the file `/etc/xdg/lxsession/LXDE-pi/autostart`

```
@chromium --kiosk --incognito --disable-features=TranslateUI https://edpiv.com/?uuid=27becb79-50b7-4c65-8b58-9bdbde28678e&slideshow_id=3
@xset s noblank
@xset s off
@xset s -dpms
```

## Get Raspberry IP from your computer

> Your computer must be connected on the same wifi (or connect it via ethernet or USB)

Run: `ping -c1 raspberrypi.local -c1 | head -1 | grep -Eo '[0-9.]{4,}'` and you'll see the raspberry IP, note it.