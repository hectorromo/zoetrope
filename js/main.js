


class Sound() {
	constructor() {
		this.file = new Howl({
	      src: ['./sound/r.mp3'],
	      loop: true
	    });
	}

}





const zoetrope = new Zoetrope('.container');
zoetrope.init();

