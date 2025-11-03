@echo off
echo ================================================
echo   Vox Learner - Tamil Course Data Setup
echo ================================================
echo.
echo This will copy the SAMPLE course data to your
echo actual course_data.json file.
echo.
echo Location: public\data\python\Tamil\
echo.
pause

cd public\data\python\Tamil

echo.
echo Copying course_data_SAMPLE.json to course_data.json...
copy /Y course_data_SAMPLE.json course_data.json

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCCESS! Course data has been updated!
    echo ================================================
    echo.
    echo Your Tamil Python course now has:
    echo   - 10 Modules
    echo   - 38 Topics  
    echo   - All content in Tamil
    echo   - 14+ hours of video content
    echo.
    echo Next Steps:
    echo   1. Refresh your browser (Ctrl+R)
    echo   2. Open Vox Learner (book icon)
    echo   3. See your complete Tamil course!
    echo.
) else (
    echo.
    echo ERROR: Could not copy file!
    echo Please check if the files exist.
    echo.
)

echo.
pause
