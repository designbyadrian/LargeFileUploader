# LargeFileUploader
File upload SAP with upload time estimation

##Installation

###Requires
NPM, Server running PHP

###Instructions
Navigate to root folder with your preferred terminal application, then type `> npm install`

Point your PHP server to the root folder. Find `gulpfile.js` and then the line that contains this:

```javascript
browserSync({
	proxy: 'lfu:8888',
```

Set proxy address to that of the PHP server, then run everything by typing

`> gulp`