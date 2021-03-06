// package com.musically.react;

// import android.annotation.SuppressLint;
// import android.content.ContentResolver;
// import android.content.ContentUris;
// import android.content.Context;
// import android.content.pm.PackageManager;
// import android.database.Cursor;
// import android.graphics.Bitmap;
// import android.graphics.BitmapFactory;
// import android.media.MediaMetadataRetriever;
// import android.net.Uri;
// import android.os.Build;
// import android.os.Environment;
// import android.provider.MediaStore;
// import android.renderscript.Allocation;
// import android.renderscript.Element;
// import android.renderscript.RenderScript;
// import android.renderscript.ScriptIntrinsicBlur;
// import android.util.Base64;
// import android.util.Log;
// import android.os.AsyncTask;

// import com.facebook.react.bridge.Callback;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.WritableArray;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.bridge.WritableNativeArray;
// import com.facebook.react.bridge.WritableNativeMap;

// import org.json.JSONArray;
// import org.json.JSONException;
// import org.json.JSONObject;

// import java.io.ByteArrayOutputStream;
// import java.io.File;
// import java.io.FileNotFoundException;
// import java.io.FileOutputStream;
// import java.io.FileInputStream;
// import java.io.IOException;
// import java.util.ArrayList;
// import java.util.HashMap;

// public class MusicFileManager extends ReactContextBaseJavaModule {
//     private static MusicFileManager instance = null;
    
//     private WritableArray _jsonReturnArray;
//     private Callback _errorCallback;
//     private Callback _successCallback;
//     private String _error;
//     private Boolean _createBlur;
//     private Boolean _success;
//     private ContentResolver _musicResolver;
//     private Context _context; 

//     public static MusicFileManager getInstance(ReactApplicationContext reactContext) {
//         if (instance == null) {
//             instance = new MusicFileManager(reactContext);
//         }

//         return instance;
//     }

//     private MusicFileManager(ReactApplicationContext reactContext) {
//         super(reactContext);

//         this._context = reactContext;
//     }

//     @Override
//     public String getName() {
//         return "MusicFileManager";
//     }

//     private void consumeSuccessCallback() {
//         if(this._successCallback != null && this._success) {

//             this._successCallback.invoke(this._jsonReturnArray);
//             this._successCallback = null;
//         }
//     }

//     private void consumeErrorCallback() {
//         if(this._errorCallback != null) {

//             this._errorCallback.invoke(this._error);
//             this._errorCallback = null;
//         }
//     }

//     @ReactMethod
//     public void getAll(Boolean createBlur, Callback errorCallback, Callback successCallback){

//         this._errorCallback = errorCallback;
//         this._successCallback = successCallback;
//         this._createBlur = createBlur;
//         this._musicResolver = this.getCurrentActivity().getContentResolver();
//         this._jsonReturnArray = new WritableNativeArray();

//         new AsyncTask<Void, Void, Void>() {
            
//             @Override
//             protected Void doInBackground(Void... params) {
//                 Uri musicUri = android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
//                 String selection = MediaStore.Audio.Media.IS_MUSIC + "!= 0";
//                 String sortOrder = MediaStore.Audio.Media.TITLE + " ASC";
//                 Cursor musicCursor = _musicResolver.query(musicUri, null, selection, null, sortOrder);
        
//                 if (musicCursor != null && musicCursor.moveToFirst()) {
                    
//                     if(musicCursor.getCount() > 0){
        
//                         MediaMetadataRetriever mmr = new MediaMetadataRetriever();
        
//                         try {
//                             WritableMap items;
//                             byte[] art;
        
//                             long thisId;
//                             String thisPath;
//                             String fileName;
//                             String thisTitle;
//                             String thisArtist;
//                             String duration;
//                             String album;
//                             String artist;
//                             String title;
//                             String genre;
//                             String encoded;
//                             String blurred;
        
//                             while(musicCursor.moveToNext())
//                             {
//                                 try{
//                                     items = new WritableNativeMap();
        
//                                     thisId = musicCursor.getLong(musicCursor.getColumnIndex(android.provider.MediaStore.Audio.Media._ID));
//                                     thisPath = musicCursor.getString(musicCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA));
//                                     thisTitle = musicCursor.getString(musicCursor.getColumnIndex(android.provider.MediaStore.Audio.Media.TITLE));
//                                     thisArtist = musicCursor.getString(musicCursor.getColumnIndex(android.provider.MediaStore.Audio.Media.ARTIST));
//                                     duration = musicCursor.getString(musicCursor.getColumnIndex(MediaStore.Audio.Media.DURATION));
        
//                                     if(thisPath != null && thisPath != "" && thisPath.endsWith(".mp3")) {
                                        
//                                         mmr.setDataSource(thisPath);
        
//                                         fileName = thisPath.substring(thisPath.lastIndexOf("/") + 1);
        
//                                         album = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM);
//                                         artist = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST);
//                                         title = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE);
//                                         genre = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_GENRE);
//                                         encoded = "";
//                                         blurred = "";
        
//                                         art = mmr.getEmbeddedPicture();
        
//                                         if (album == null) {
//                                             album = thisArtist;
//                                         }
        
//                                         if (artist == null) {
//                                             artist = thisArtist;
//                                         }
        
//                                         if (title == null) {
//                                             title = thisTitle;
//                                         }
        
//                                         if (art != null && art.length > 0) {
//                                             Bitmap songImage = BitmapFactory.decodeByteArray(art, 0, art.length);
        
//                                             try {
//                                                 String pathToImg = Environment.getExternalStorageDirectory() + "/" + thisId + ".jpg";
//                                                 encoded = this.saveImageToStorageAndGetPath(pathToImg, songImage);
//                                             } catch (Exception e) {

//                                             }
        
//                                             if (_createBlur) {
//                                                 try {
//                                                     String pathToImg = Environment.getExternalStorageDirectory() + "/" + thisId + "-blur.jpg";
//                                                     blurred = this.saveBlurImageToStorageAndGetPath(pathToImg, songImage);
//                                                 } catch (Exception e) {
        
//                                                 }
//                                             }
//                                         }
        
//                                         String str = String.valueOf(thisId);
        
//                                         items.putString("id", str);
//                                         items.putString("album", album);
//                                         items.putString("artist", artist);
//                                         items.putString("title", title);
//                                         items.putString("genre", genre);
        
//                                         if (encoded == null || encoded == "") {
//                                             items.putString("cover", "");
//                                         } else {
//                                             items.putString("cover", "file://" + encoded);
//                                         }
        
//                                         if (blurred == "") {
//                                             items.putString("blur", "");
//                                         } else {
//                                             items.putString("blur", "file://" + blurred);
//                                         }
        
//                                         items.putString("duration", duration);
//                                         items.putString("path", thisPath);
//                                         items.putString("fileName", fileName);

//                                         _jsonReturnArray.pushMap(items);
//                                     }
//                                 } catch (Exception e) {
        
//                                 }
//                             }

//                             _success = true;
//                         } catch (Exception e) {
//                             _error = "Error: " + e.toString();
//                         } finally {
//                             mmr.release();
//                         }
//                     }
//                 }
    
//                 return null;
//             }
            
//             protected void onPostExecute(Void dummy) {
//                 if(_success) {
//                     consumeSuccessCallback();
//                 }
//                 else {
//                     consumeErrorCallback();
//                 }
//             }

//             private String saveImageToStorageAndGetPath(String pathToImg, Bitmap songImage) throws IOException {
//                 if (songImage != null) {
//                     ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//                     songImage.compress(Bitmap.CompressFormat.JPEG, 60, byteArrayOutputStream);
//                     byte[] byteArray = byteArrayOutputStream.toByteArray();
        
//                     if (byteArray != null && byteArray.length > 0) {
//                         this.saveToStorage(pathToImg, byteArray);
            
//                         return pathToImg;
//                     }
//                 }
        
//                 return null;
//             }
        
//             private String saveBlurImageToStorageAndGetPath(String pathToImg, Bitmap songImage) throws IOException {
//                 if (songImage != null) {
//                     Blur blur = new Blur();
//                     Bitmap blurimg = blur.fastblur(_context, songImage, 20);
        
//                     if (blurimg != null) {
//                         ByteArrayOutputStream byteArrayOutputStreams = new ByteArrayOutputStream();
        
//                         blurimg.compress(Bitmap.CompressFormat.JPEG, 60, byteArrayOutputStreams);
//                         byte[] byteArray = byteArrayOutputStreams.toByteArray();
        
//                         if (byteArray != null && byteArray.length > 0) {
//                             this.saveToStorage(pathToImg, byteArray);
            
//                             return pathToImg;
//                         }
        
//                     }
//                 }
        
//                 return null;
//             }
        
//             private void saveToStorage(String pathToImg, byte[] imageBytes) throws IOException {
//                 FileOutputStream fos = null;
//                 try {
//                     File filePath = new File(pathToImg);
//                     fos = new FileOutputStream(filePath, true);
//                     fos.write(imageBytes);
//                 } finally {
//                     if (fos != null) {
//                         fos.flush();
//                         fos.close();
//                     }
//                 }
//             }
//         }.execute();
//     }
// }

// class Blur {

//     private static final String TAG = "Blur";

//     @SuppressLint("NewApi")
//     public static Bitmap fastblur(Context context, Bitmap sentBitmap, int radius) {

//         if (Build.VERSION.SDK_INT > 16) {
//             Bitmap bitmap = sentBitmap.copy(sentBitmap.getConfig(), true);

//             final RenderScript rs = RenderScript.create(context);
//             final Allocation input = Allocation.createFromBitmap(rs, sentBitmap, Allocation.MipmapControl.MIPMAP_NONE, Allocation.USAGE_SCRIPT);
//             final Allocation output = Allocation.createTyped(rs, input.getType());
//             final ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
//             script.setRadius(radius);
//             script.setInput(input);
//             script.forEach(output);
//             output.copyTo(bitmap);
//             return bitmap;
//         }

//         Bitmap bitmap = sentBitmap.copy(sentBitmap.getConfig(), true);

//         if (radius < 1) {
//             return (null);
//         }

//         int w = bitmap.getWidth();
//         int h = bitmap.getHeight();

//         int[] pix = new int[w * h];
//         bitmap.getPixels(pix, 0, w, 0, 0, w, h);

//         int wm = w - 1;
//         int hm = h - 1;
//         int wh = w * h;
//         int div = radius + radius + 1;

//         int r[] = new int[wh];
//         int g[] = new int[wh];
//         int b[] = new int[wh];
//         int rsum, gsum, bsum, x, y, i, p, yp, yi, yw;
//         int vmin[] = new int[Math.max(w, h)];

//         int divsum = (div + 1) >> 1;
//         divsum *= divsum;
//         int dv[] = new int[256 * divsum];
//         for (i = 0; i < 256 * divsum; i++) {
//             dv[i] = (i / divsum);
//         }

//         yw = yi = 0;

//         int[][] stack = new int[div][3];
//         int stackpointer;
//         int stackstart;
//         int[] sir;
//         int rbs;
//         int r1 = radius + 1;
//         int routsum, goutsum, boutsum;
//         int rinsum, ginsum, binsum;

//         for (y = 0; y < h; y++) {
//             rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
//             for (i = -radius; i <= radius; i++) {
//                 p = pix[yi + Math.min(wm, Math.max(i, 0))];
//                 sir = stack[i + radius];
//                 sir[0] = (p & 0xff0000) >> 16;
//                 sir[1] = (p & 0x00ff00) >> 8;
//                 sir[2] = (p & 0x0000ff);
//                 rbs = r1 - Math.abs(i);
//                 rsum += sir[0] * rbs;
//                 gsum += sir[1] * rbs;
//                 bsum += sir[2] * rbs;
//                 if (i > 0) {
//                     rinsum += sir[0];
//                     ginsum += sir[1];
//                     binsum += sir[2];
//                 } else {
//                     routsum += sir[0];
//                     goutsum += sir[1];
//                     boutsum += sir[2];
//                 }
//             }
//             stackpointer = radius;

//             for (x = 0; x < w; x++) {

//                 r[yi] = dv[rsum];
//                 g[yi] = dv[gsum];
//                 b[yi] = dv[bsum];

//                 rsum -= routsum;
//                 gsum -= goutsum;
//                 bsum -= boutsum;

//                 stackstart = stackpointer - radius + div;
//                 sir = stack[stackstart % div];

//                 routsum -= sir[0];
//                 goutsum -= sir[1];
//                 boutsum -= sir[2];

//                 if (y == 0) {
//                     vmin[x] = Math.min(x + radius + 1, wm);
//                 }
//                 p = pix[yw + vmin[x]];

//                 sir[0] = (p & 0xff0000) >> 16;
//                 sir[1] = (p & 0x00ff00) >> 8;
//                 sir[2] = (p & 0x0000ff);

//                 rinsum += sir[0];
//                 ginsum += sir[1];
//                 binsum += sir[2];

//                 rsum += rinsum;
//                 gsum += ginsum;
//                 bsum += binsum;

//                 stackpointer = (stackpointer + 1) % div;
//                 sir = stack[(stackpointer) % div];

//                 routsum += sir[0];
//                 goutsum += sir[1];
//                 boutsum += sir[2];

//                 rinsum -= sir[0];
//                 ginsum -= sir[1];
//                 binsum -= sir[2];

//                 yi++;
//             }
//             yw += w;
//         }
//         for (x = 0; x < w; x++) {
//             rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
//             yp = -radius * w;
//             for (i = -radius; i <= radius; i++) {
//                 yi = Math.max(0, yp) + x;

//                 sir = stack[i + radius];

//                 sir[0] = r[yi];
//                 sir[1] = g[yi];
//                 sir[2] = b[yi];

//                 rbs = r1 - Math.abs(i);

//                 rsum += r[yi] * rbs;
//                 gsum += g[yi] * rbs;
//                 bsum += b[yi] * rbs;

//                 if (i > 0) {
//                     rinsum += sir[0];
//                     ginsum += sir[1];
//                     binsum += sir[2];
//                 } else {
//                     routsum += sir[0];
//                     goutsum += sir[1];
//                     boutsum += sir[2];
//                 }

//                 if (i < hm) {
//                     yp += w;
//                 }
//             }
//             yi = x;
//             stackpointer = radius;
//             for (y = 0; y < h; y++) {
//                 // Preserve alpha channel: ( 0xff000000 & pix[yi] )
//                 pix[yi] = (0xff000000 & pix[yi]) | (dv[rsum] << 16) | (dv[gsum] << 8) | dv[bsum];

//                 rsum -= routsum;
//                 gsum -= goutsum;
//                 bsum -= boutsum;

//                 stackstart = stackpointer - radius + div;
//                 sir = stack[stackstart % div];

//                 routsum -= sir[0];
//                 goutsum -= sir[1];
//                 boutsum -= sir[2];

//                 if (x == 0) {
//                     vmin[y] = Math.min(y + r1, hm) * w;
//                 }
//                 p = x + vmin[y];

//                 sir[0] = r[p];
//                 sir[1] = g[p];
//                 sir[2] = b[p];

//                 rinsum += sir[0];
//                 ginsum += sir[1];
//                 binsum += sir[2];

//                 rsum += rinsum;
//                 gsum += ginsum;
//                 bsum += binsum;

//                 stackpointer = (stackpointer + 1) % div;
//                 sir = stack[stackpointer];

//                 routsum += sir[0];
//                 goutsum += sir[1];
//                 boutsum += sir[2];

//                 rinsum -= sir[0];
//                 ginsum -= sir[1];
//                 binsum -= sir[2];

//                 yi += w;
//             }
//         }

//         bitmap.setPixels(pix, 0, w, 0, 0, w, h);
//         return (bitmap);
//     }
// }
