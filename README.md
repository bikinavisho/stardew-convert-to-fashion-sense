# Convert Hairstyles to Fashion Sense mod packs!

This code allows you to convert a hairstyles.png into a Fashion Sense modpack!

It requires a little bit of code know-how, and having npm set up on your computer.


## Step 1 : Cut the Sprite Sheet
Use https://ezgif.com/sprite-cutter/ to cut your `hairstyles.png` into individual
hairstyle files. Use the Cutting Method of "By number of columns / rows". For a
typical `hairstyles.png` the number of columns will be eight. You count the number
of rows by counting all the front-facing hairstyles going down. Once you're done,
click "Download frames as a zip", then extract that to get all your individual
files for your hairstyles.

### Tips & Tricks!
An easy way to get the number of rows and columns needed is to follow the following formula:
- take the width of the image, and divide it by 16, that's your number of columns
- take the height of the image, and divide it by 96, that's your number of rows

## Step 2 : Get the code ready
- Clone the project down from GitHub
- run `npm install` inside the project directory
- create two directories inside the project: `input` and `output`
- code is ready to run! just a few more steps

## Step 3 - Sort the hairstyles
Now it's time for this code to shine! Note that this step requires human sorting
of the files into "colorable" and "non-colorable" hairstyles. Colorable
hairstyles are usually in grayscale, whereas non-colorable are usually not in
grayscale. If you don't want to do this, you can just have them all not be
colorable, which is the code's default.

## Step 4 - Run the code!
First, drag all the colorable files into the `input` directory in this project.
Then, run
`npm start -- -- --conversionType=hair --isColorable --authorName=NAMEOFAUTHOR --hairDescriptor=ADJECTIVE`.
There are a few customizable parameters that you can alter accordingly. First,
you should enter the original name of the author whose hairstyles you are
converting. This will enter it in Fashion Sense as `AUTHOR's Hairstyle 01`. If
you specify a `hairDescriptor`, it will add that after the author's name,
resulting in `AUTHOR's ADJECTIVE Hairstyle 01`, which makes it a lot easier to
search for hairstyles you want in the Fashion Sense interface later.

For example, if you enter the command `npm start -- -- --conversionType=hair --isColorable --authorName=BikiFae --hairDescriptor=Braided`,
it will result in hairstyles named as `BikiFae's Braided Hairstyle 01 (Dyeable)`.

After executing the command above with the parameters you want, you will find
the Fashion Sense converted hairstyles in the `output` directory, with the file
names corresponding to the tile number that the program from Step 1 gave them.

Move these files to your Fashion Sense pack, to the "Hairs" directory.

Delete the files in the `input` directory.
Move the non-colorable files into the `input` directory.

Now run
`npm start -- -- --conversionType=hair --authorName=NAMEOFAUTHOR --hairDescriptor=ADJECTIVE`.,
and your Fashion Sense converted hairstyles will again be found in the `output`
directory.
(If you're wondering why `--isColorable` is no longer there, it's because the
code defaults to isColorable:false, and adding `--isColorable` changes it to
true. So when you want it to not be colorable, all you have to do is remove the
parameter.)

Move these files from the `output` directory to your Fashion Sense pack, inside
the "Hairs" directory.

You're done!


# Convert Shirts / Hats from Json Assets to Fashion Sense!

New functionality has been added to the project! Now you can convert Json Assets
clothing and hat packs into Fashion Sense content packs.

## Step 1 - Copy the files over
Inside the JSON assets package, copy the entire contents of the Hats OR Shirts
directory inside the JA package over to the `input` directory. This application
can only handle converting ONLY hats OR shirts at one time.

## Step 2 - Run the Code!
Run the following command:

for a shirt:
```
npm start -- -- --conversionType=TYPE --authorName=AUTHOR --prefix=PREFIX --hasSleeves
```
for a hat:
```
npm start -- -- --conversionType=TYPE --authorName=AUTHOR --prefix=PREFIX
```
- where `TYPE` is either `hat` or `shirt`
- where `AUTHOR` is the name of the original author who created the shirts/hats
- where `PREFIX` is a descriptor you want to go between the author name and the
name of the item for all items in the set, for example, if it's a summer set,
and you pass in `--prefix=Summer` then the items will be called something like
`AUTHOR's Summer Blouse`. This is an OPTIONAL parameter and be removed if you
do not want to use it.
- if you don't want any of the shirts to have sleeves in the Fashion Sense
framework, remove the `--hasSleeves` parameter from the command above. This
only applies if you are using `--conversionType=shirt`.

Note: currently all sleeves default to white, since it's difficult to
programmatically and accurately determine which color the sleeves *should* be.
You can manually go in and change this later, file by file, if you so choose.

## Step 3 - Copy the Files over to your Fashion Sense pack!
You will find the Fashion Sense shirts inside the `output` directory after
running the command mentioned above. Go ahead and drag the contents of the
`output` directory into a directory called `Shirts` in your Fashion Sense pack.


## Step 4 (Optional) - Fix the Sleeve Colors
1. Open the shirt.png file in your image editor of choice, one that specifically
can read RGB values. I personally use GIMP for this, since it's free and
open-source.
2. Use the eye drop tool to select the color you want the sleeves to be, and
find its RGB value.
3. Open the shirt.json
4. The property you'll be editing is `SleeveColors` and you'll have to edit it
to be the same for both `FrontShirt`, `BackShirt`, `LeftShirt`, and `RightShirt`
properties. As stated in the Fashion Sense documentation, "The first color
given will replace the vanilla sleeve's darkest color, while the second
replaces the medium color and the last will replace the lightest color."
5. Take the RGB values and put them in that order for the `SleeveColors`
property of all four options.
6. Test it in game, and if you don't like the color, tweak it and preview it
quickly via `fs_reload`.


## New To Programming? 
You'll need node.js and npm, instructions found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

I use Windows Terminal, download found [here](https://apps.microsoft.com/store/detail/9N0DX20HK701?hl=en-us&gl=US)
