var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

btSerial.on('found', function(address, name) {

	console.log('address=' + address);
	console.log('name=' + name);
	
	if (name === 'RN42-9699' && address == '00-06-66-65-96-99' ) {
	
    btSerial.findSerialPortChannel(address, function(channel) {
    
        btSerial.connect(address, channel, function() {
        
            console.log('connected');

            // Write data
            btSerial.write(new Buffer('1', 'utf-8'), function(err, bytesWritten) {
            
                if (err) console.log(err);
                console.log("bytesWritten=",bytesWritten);
            });

            // When data received
            btSerial.on('data', function(buffer) {
            
                console.log(buffer.toString('utf-8'));
            });
            
        }, function (error) {
            console.log('cannot connect',error);
        });

        // close the connection when you're ready
        btSerial.close();
        
    }, function(error) {
        console.log('found nothing',error);
    });
	}
	else {

		console.log('skipping ' + name);
	}
});

btSerial.inquire();
