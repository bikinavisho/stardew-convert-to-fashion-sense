const fsPromises = require('fs').promises;
const editJsonFile = require("edit-json-file");
const _ = require('lodash');
const jsonFile = require('jsonfile')

// empty out anything that previously was generated in the output folder,
// then recreate the output folder
// then start execution of reading/translating/writing
fsPromises.rm('./output', {recursive: true}).then(() => {
  fsPromises.mkdir('./output').then(() => {
    fsPromises.readdir('./input').then((fileNames) => {
      let numberOfFiles = fileNames.length;
      fileNames.forEach((fileName) => {
        const paddedIndex = _.replace(_.replace(fileName, 'tile', ''), '.png', '');
        fsPromises.mkdir(`./output/${paddedIndex}`).then(() => {
          let hairstyleObject = _.cloneDeep(COLORABLE_HAIR);
          //let hairstyleObject = _.cloneDeep(UNCOLORABLE_HAIR);

          hairstyleObject["Name"] = paddedIndex;

          fsPromises.writeFile(`./output/${paddedIndex}/hair.json`, JSON.stringify(hairstyleObject, null, "\t")).then(() => {
            console.log('hair.json created for ' + paddedIndex);
          }).catch((e) => {
            console.log('failed to create hair.json for ' + paddedIndex);
            console.log(e);
          });

          fsPromises.copyFile(`./input/${fileName}`, `./output/${paddedIndex}/hair.png`).then(() => {
            console.log('hair.png copied over for ' + paddedIndex);
          }).catch((e) => {
            console.log('failed to copy hair.png for ' + paddedIndex);
            console.log(e);
          });
        });
      });
    });
  });
});


const UNCOLORABLE_HAIR = {
  "Name": "",
  "FrontHair": {
    "DisableGrayscale": true,
	"StartingPosition": {
      "X": 0,
      "Y": 0
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "RightHair": {
    "DisableGrayscale": true,
	"StartingPosition": {
      "X": 0,
      "Y": 32
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "LeftHair": {
   "DisableGrayscale": true,
   "Flipped": true,
	"StartingPosition": {
      "X": 0,
      "Y": 32
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "BackHair": {
    "DisableGrayscale": true,
	"StartingPosition": {
      "X": 0,
      "Y": 64
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  }
};
const COLORABLE_HAIR = {
  "Name": "",
  "FrontHair": {
    "StartingPosition": {
      "X": 0,
      "Y": 0
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "RightHair": {
    "StartingPosition": {
      "X": 0,
      "Y": 32
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "LeftHair": {
    "Flipped": true,
	"StartingPosition": {
      "X": 0,
      "Y": 32
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  },
  "BackHair": {
    "StartingPosition": {
      "X": 0,
      "Y": 64
    },
    "HeadPosition": {
      "X": 0,
      "Y": 0
    },
    "HairSize": {
      "Width": 16,
      "Length": 32
    }
  }
};
