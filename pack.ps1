$script:arch = $null;
$script:target = '0.35.1';
$script:platform = $null;

Function DeleteUselessFiles() {
    Get-ChildItem ./out | ForEach-Object -Process {
        if ($_ -is [System.IO.DirectoryInfo]) {
            Remove-Item -Path ./out/$_/locales -Recurse
            Remove-Item -Path ./out/$_/resources/default_app -Recurse
            Remove-Item -Path ./out/$_/pdf.dll
            Remove-Item -Path ./out/$_/version
            Remove-Item -Path ./out/$_/LICENSE
            Remove-Item -Path ./out/$_/xinput1_3.dll
            Remove-Item -Path ./out/$_/d3dcompiler_47.dll
            Remove-Item -Path ./out/$_/vccorlib120.dll
            Copy-Item -Path ./config.js -Destination ./out/$_/
        }
    }
}

Function BuildElectron($platform, $arch) {
    $script:platform = $platform
    $script:arch = $arch
    RebuildModule 'electron-penetrate'
    RebuildModule 'windows-caption-color'
    electron-packager ./ danmu-client `
        --asar `
        --overwrite `
        --icon=danmu.ico `
        --app-version=1.0.3 `
        --out="./out" `
        --ignore="""\.(pdb|exp|lib|map|obj|tlog|vcxproj|gypi|sln|md|log|bin)$|out|node-gyp|nw|nw-.*|.git""" `
        --arch=$script:arch --platform=$script:platform --version=$script:target `
        --version-string.ProductName="DANMU Client" `
        --version-string.CompanyName="zsx (http://www.zsxsoft.com)" `
        --version-string.OriginalFilename="danmu-client.exe" `
        --version-string.FileVersion="1.0.3" `
        --version-string.InternalName="DANMU Client" `
        --version-string.FileDescription="DANMU" `
        --version-string.LegalCopyright="https://github.com/zsxsoft/danmu-client/" 
}

Function RebuildModule($module) {
    Write-Host 'Building' $module 
    cd node_modules/$module
    node-gyp rebuild --arch=$script:arch --platform=$script:platform --target=$script:target --dist-url=https://atom.io/download/atom-shell
    cd ../../
    Write-Host $module "successful built!"
}

BuildElectron 'win32' 'ia32'
BuildElectron 'win32' 'x64'
DeleteUselessFiles