// package com.musically.react;

// import com.facebook.react.ReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.uimanager.ViewManager;

// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;

// import com.musically.react.MusicFileManager;

// public class MusicFileManagerPackage implements ReactPackage {

//     public MusicFileManagerPackage() {

//     }

//     @Override
//     public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
//         List<NativeModule> modules = new ArrayList<>();

//         modules.add(MusicFileManager.getInstance(reactContext));

//         return modules;
//     }

//     @Override
//     public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//         List<ViewManager> modules = new ArrayList<>();
//         return modules;
//     }
// }
