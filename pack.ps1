$script:arch = $null;
$script:target = '0.33.3';
$script:platform = $null;

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
        --ignore='nw-' `
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