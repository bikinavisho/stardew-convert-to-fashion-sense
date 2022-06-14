const fsPromises = require('fs').promises;
const loadJson5File = require('read-json5-file');
const _ = require('lodash');
const jsonFile = require('jsonfile')
const path = require('path');

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
   { name: 'conversionType', type: String, defaultOption: true, alias: 't' },
   { name: 'authorName', type: String, alias: 'a' },
   { name: 'prefix', type: String, alias: 'p' },
   { name: 'hairDescriptor', type: String },
   { name: 'isColorable', type: Boolean, alias: 'c' },
   { name: 'hasSleeves', type: Boolean, alias: 's' },
];
const options = commandLineArgs(optionDefinitions)

console.log('options: ', options);

// empty out anything that previously was generated in the output folder,
// then recreate the output folder
// then start execution of reading/translating/writing
fsPromises.rm('./output', {recursive: true}).then(() => {
  fsPromises.mkdir('./output').then(() => {
    fsPromises.readdir('./input').then((fileNames) => {
      let numberOfFiles = fileNames.length;

      // this variable only truly applies to the isHair flow
      let isColorable = false;
      if (options.isColorable) {
        isColorable = options.isColorable;
      }


      // toggle the type of conversion you're performing today
      let isHair = false;
      let isShirt = false;
      let isHat = false;

      let {conversionType} = options;
      console.log('conversionType: ', conversionType);
      if (conversionType) {
        conversionType = conversionType.toLowerCase();

        const validConversionTypes = ['hat', 'shirt', 'hair'];
        let isValidConversionType = !_.isEmpty(_.intersection(_.words(conversionType), validConversionTypes));
        if (isValidConversionType) {
          switch(conversionType) {
            case 'hat':
              isHat = true;
              isShirt = false;
              isHair = false;
              break;
            case 'shirt':
              isShirt = true;
              isHair = false;
              isHat = false;
              break;
            case 'hair':
              isHair = true;
              isHat = false;
              isShirt = false;
              break;
            default:
              console.log('failed to specify which type of conversion to perform');
          }
        }
      }


      fileNames.forEach((fileName) => {
        // ===================================================================
        //                      H A T S
        // ===================================================================
        if (isHat) {
          let file = readJsonFile(fileName, 'hat.json');
          if (!file.Name) {
            throw new Error("json file invalid");
          }
          let hatObject = _.cloneDeep(HAT_TEMPLATE);

          hatObject["Name"] = file.Name;
          if (options.authorName) {
            hatObject["Name"] = `${options.authorName}'s '` + hatObject["Name"];
          }
          if (!options.authorName && options.prefix) {
            hatObject["Name"] = `${options.prefix} '` + hatObject["Name"];
          }
          //hatObject["Name"] = "Author's " + shirtObject["Name"];

          if (file.ShowHair == false) {
            hatObject["FrontHat"]["HideHair"] = true;
            hatObject["RightHat"]["HideHair"] = true;
            hatObject["LeftHat"]["HideHair"] = true;
            hatObject["BackHat"]["HideHair"] = true;
          }

          fsPromises.mkdir(`./output/${fileName}/`).then(() => {
            // write json
            fsPromises.writeFile(`./output/${fileName}/hat.json`, JSON.stringify(hatObject, null, "\t")).then(() => {
              console.log('hat.json created for ' + fileName);
            }).catch((e) => {
              console.log('failed to create hat.json for ' + fileName);
              console.log(e);
            });

            // copy image over
            fsPromises.copyFile(`./input/${fileName}/hat.png`, `./output/${fileName}/hat.png`).then(() => {
              console.log('hat.png copied over for ' + fileName);
            }).catch((e) => {
              console.log('failed to copy hat.png for ' + fileName);
              console.log(e);
            });
          }).catch((exception) => {
            console.log(`failed to create directory for ${fileName}`);
          });
        }

        // ===================================================================
        //                    S H I R T S
        // ===================================================================
        if (isShirt) {
          let file = readJsonFile(fileName, 'shirt.json');
          if (!file.Name) {
            throw new Error(`json file "${fileName}/shirt.json" invalid`);
          }
          isColorable = Boolean(file.Dyeable);
          let shirtObject = _.cloneDeep(isColorable ? COLORABLE_SHIRT : NON_COLORABLE_SHIRT);


          shirtObject["Name"] = file.Name;
          if (options.authorName) {
            shirtObject["Name"] = `${options.authorName}'s ${options.hasSleeves ? '' : 'Summer '}Shirt ` + shirtObject["Name"];
          }
          if (!options.authorName && options.prefix) {
            shirtObject["Name"] = `${options.prefix} '` + shirtObject["Name"];
          }
          //shirtObject["Name"] = "Author's " + shirtObject["Name"];
          if  (isColorable) {
            shirtObject["Name"] += " (Dyeable)";
          }

          const shirtModelArray = ['BackShirt', 'FrontShirt', 'LeftShirt', 'RightShirt'];

          if (options.hasSleeves == false) {
            shirtModelArray.forEach((shirtModel) => {
              delete shirtObject[shirtModel].SleeveColors;
            })
          }

          fsPromises.mkdir(`./output/${fileName}/`).then(() => {
            // --write json--
            fsPromises.writeFile(`./output/${fileName}/shirt.json`, JSON.stringify(shirtObject, null, "\t")).then(() => {
              console.log('shirt.json created for ' + fileName);
            }).catch((e) => {
              console.log('failed to create shirt.json for ' + fileName);
              console.log(e);
            });

            // --copy image over--
            // default to female version because most don't have a difference
            // and I usually play as a female character ;P
            if (file.HasFemaleVariant) {
              fsPromises.copyFile(`./input/${fileName}/female.png`, `./output/${fileName}/shirt.png`).then(() => {
                console.log('female.png copied over for ' + fileName);
              }).catch((e) => {
                console.log('failed to copy female.png for ' + fileName);
                console.log(e);
              });
            } else {
              fsPromises.copyFile(`./input/${fileName}/male.png`, `./output/${fileName}/shirt.png`).then(() => {
                console.log('male.png copied over for ' + fileName);
              }).catch((e) => {
                console.log('failed to copy male.png for ' + fileName);
                console.log(e);
              });
            }
          }).catch((exception) => {
            console.log(`failed to create directory for ${fileName}`);
          });
        }
        // ===================================================================
        //                              H A I R
        // ===================================================================
        if (isHair) {
          // expected input from the sprite cutter website referenced in the README
          // in the format `tile000.png`...
          const paddedIndex = _.replace(_.replace(fileName, 'tile', ''), '.png', '');
          fsPromises.mkdir(`./output/${paddedIndex}`).then(() => {
            if (isHair) {
              let hairstyleObject = _.cloneDeep(isColorable ? COLORABLE_HAIR : UNCOLORABLE_HAIR);

              //NOTE: CHANGE THE BELOW VARIABLES TO MATCH YOUR RUN
              let authorName = '';
              let hairDescriptor = 'Long';    // Long, Short, Wavy, etc.

              if (options.authorName) {
                authorName = options.authorName;
              }
              if (options.hairDescriptor) {
                hairDescriptor = options.hairDescriptor;
              }

              // set the object's display name
              hairstyleObject["Name"] = `${authorName}'s ${hairDescriptor} Hairstyle ${paddedIndex}`;
              //hairstyleObject["Name"] = `${hairDescriptor} Sakura Hairstyle ${paddedIndex}`;
              if  (isColorable) {
                hairstyleObject["Name"] += " (Dyeable)";
              }

              // write to the json
              fsPromises.writeFile(`./output/${paddedIndex}/hair.json`, JSON.stringify(hairstyleObject, null, "\t")).then(() => {
                console.log('hair.json created for ' + paddedIndex);
              }).catch((e) => {
                console.log('failed to create hair.json for ' + paddedIndex);
                console.log(e);
              });

              // copy the image file over
              fsPromises.copyFile(`./input/${fileName}`, `./output/${paddedIndex}/hair.png`).then(() => {
                console.log('hair.png copied over for ' + paddedIndex);
              }).catch((e) => {
                console.log('failed to copy hair.png for ' + paddedIndex);
                console.log(e);
              });
            }
          });
        }
      });
    });
  });
});


function readJsonFile(fileName, targetJson) {
  const fixture = path.join(__dirname, `/input/${fileName}/${targetJson}`)
  const fileContents = loadJson5File.sync(fixture);
  return fileContents;
}

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

const COLORABLE_SHIRT = {
  "Name": "",
  "FrontShirt": {
    "SleeveColors": [
      [ 160, 160, 160 ],
      [ 201, 201, 201 ],
      [ 237, 237, 237 ],
    ],
    "StartingPosition": {
      "X": 0,
      "Y": 0
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "RightShirt": {
    "SleeveColors": [
      [ 160, 160, 160 ],
      [ 201, 201, 201 ],
      [ 237, 237, 237 ],
    ],
    "StartingPosition": {
      "X": 0,
      "Y": 8
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "LeftShirt": {
    "SleeveColors": [
      [ 160, 160, 160 ],
      [ 201, 201, 201 ],
      [ 237, 237, 237 ],
    ],
    "StartingPosition": {
      "X": 0,
      "Y": 16
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "BackShirt": {
    "SleeveColors": [
      [ 160, 160, 160 ],
      [ 201, 201, 201 ],
      [ 237, 237, 237 ],
    ],
    "StartingPosition": {
      "X": 0,
      "Y": 24
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  }
};
const NON_COLORABLE_SHIRT = {
  "Name": "",
  "FrontShirt": {
    "SleeveColors": [
      [ 225, 218, 218],
      [ 241, 234, 234 ],
      [ 250, 243, 243],
    ],
    "DisableGrayscale": true,
    "StartingPosition": {
      "X": 0,
      "Y": 0
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "RightShirt": {
    "SleeveColors": [
      [ 225, 218, 218],
      [ 241, 234, 234 ],
      [ 250, 243, 243],
    ],
    "DisableGrayscale": true,
    "StartingPosition": {
      "X": 0,
      "Y": 8
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "LeftShirt": {
    "SleeveColors": [
      [ 225, 218, 218],
      [ 241, 234, 234 ],
      [ 250, 243, 243],
    ],
    "DisableGrayscale": true,
    "StartingPosition": {
      "X": 0,
      "Y": 16
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  },
  "BackShirt": {
    "SleeveColors": [
      [ 225, 218, 218],
      [ 241, 234, 234 ],
      [ 250, 243, 243],
    ],
    "DisableGrayscale": true,
    "StartingPosition": {
      "X": 0,
      "Y": 24
    },
    "BodyPosition": {
      "X": 0,
      "Y": 0
    },
    "ShirtSize": {
      "Width": 8,
      "Length": 8
    }
  }
};

const HAT_TEMPLATE = {
	"Name": "",
  "FrontHat": {
    "DisableGrayscale": true,
		"StartingPosition": {
			"X": 0,
			"Y": 0
		},
		"HeadPosition": {
			"X": 0,
			"Y": 0
		},
		"HatSize": {
			"Width": 20,
			"Length": 20
		}
	},
	"RightHat": {
    "DisableGrayscale": true,
		"StartingPosition": {
			"X": 0,
			"Y": 20
		},
		"HeadPosition": {
			"X": 0,
			"Y": 0
		},
		"HatSize": {
			"Width": 20,
			"Length": 20
		}
	},
	"LeftHat": {
    "DisableGrayscale": true,
		"StartingPosition": {
			"X": 0,
			"Y": 40
		},
		"HeadPosition": {
			"X": 0,
			"Y": 0
		},
		"HatSize": {
			"Width": 20,
			"Length": 20
		}
	},
	"BackHat": {
    "DisableGrayscale": true,
		"StartingPosition": {
			"X": 0,
			"Y": 60
		},
		"HeadPosition": {
			"X": 0,
			"Y": 0
		},
		"HatSize": {
			"Width": 20,
			"Length": 20
		}
	}
};
