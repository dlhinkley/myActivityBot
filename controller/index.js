var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

btSerial.on('found', function(address, name) {
	console.log('address=' + address);
	console.log('name=' + name);
	if (name === 'RN42-9699' ) {
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('connected');

            btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
                if (err) console.log(err);
		console.log("bytesWritten=",bytesWritten);
            });

            btSerial.on('data', function(buffer) {
                console.log(buffer.toString('utf-8'));
            });
        }, function () {
            console.log('cannot connect');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('found nothing');
    });
	}
	else {

		console.log('skipping ' + name);
	}
});

btSerial.inquire();
