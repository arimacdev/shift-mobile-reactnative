# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

#Specifies not to ignore non-public library classes.
-dontskipnonpubliclibraryclasses

#Specifies not to ignore package visible library class members
-dontskipnonpubliclibraryclassmembers

-optimizationpasses 5

#Specifies that the access modifiers of classes and class members may have become broad during processing. This can improve the results of the optimization step.
-allowaccessmodification

#Specifies that interfaces may be merged, even if their implementing classes don't implement all interface methods. This can reduce the size of the output by reducing the total number of classes.
-mergeinterfacesaggressively

#Specifies to apply aggressive overloading while obfuscating. Multiple fields and methods can then get the same names, This option can make the processed code even smaller
#-overloadaggressively

#Specifies to repackage all packages that are renamed, by moving them into the single given parent package
-flattenpackagehierarchy

#Specifies to repackage all class files that are renamed, by moving them into the single given package. Without argument or with an empty string (''), the package is removed completely.
-repackageclasses

#For example, if your code contains a large number of hard-coded strings that refer to classes, and you prefer not to keep their names, you may want to use this option
-adaptclassstrings

#Specifies the resource files to be renamed, all resource files that correspond to class files are renamed
-adaptresourcefilenames

#Specifies the resource files whose contents are to be updated. Any class names mentioned in the resource files are renamed
-adaptresourcefilecontents

#Specifies not to verify the processed class files.
#-dontpreverify

-verbose

#Specifies to print any warnings about unresolved references and other important problems, but to continue processing in any case.
-ignorewarnings

# ADDED
#-dontobfuscate
#-useuniqueclassmembernames

# Enable proguard with Google libs
-keep class com.google.** { *;}
-dontwarn com.google.common.**

# Annotations are represented by attributes that have no direct effect on the execution of the code. 
-keepattributes *Annotation*

# For enumeration classes, see http://proguard.sourceforge.net/manual/examples.html#enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements javax.net.ssl.SSLSocketFactory {
   private  javax.net.ssl.SSLSocketFactory delegate;
}

# Remove debug logs in release build
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}