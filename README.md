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

## Step 2 : Get the code ready
- Clone the project
- run `npm install` inside the project directory
- code is ready to run! just a few more steps

## Step 3 - Sort the hairstyles
Now it's time for this code to shine! Note that this step requires human sorting
of the files into "colorable" and "non-colorable" hairstyles. Colorable
hairstyles are usually in grayscale, whereas non-colorable are usually not in
grayscale. If you don't want to do this, you can just have them all be colorable,
which is the code's default.

## Step 4 - Run the code!
First, drag all the colorable files into the `input` directory in this project.
Then, run `npm start`. The code will execute and your Fashion Sense converted
hairstyles will be in the `output` directory, with the file names corresponding
to the tile number that the program from Step 1 gave them.

Move these files to your Fashion Sense pack, to the "Hairs" directory.

Delete the files in the `input` directory.
Move the non-colorable files into the `input` directory.
Go into the code and comment out line 16, and uncomment out line 17.

### Before
```
let hairstyleObject = _.cloneDeep(COLORABLE_HAIR);
//let hairstyleObject = _.cloneDeep(UNCOLORABLE_HAIR);
```

### After
```
//let hairstyleObject = _.cloneDeep(COLORABLE_HAIR);
let hairstyleObject = _.cloneDeep(UNCOLORABLE_HAIR);
```

Now run `npm start` again, and your Fashion Sense converted hairstyles will again
be found in the `output` directory.

Move these files to your Fashion Sense pack, inside the "Hairs" directory.

You're done! 
