rem @echo off

if "%*" == "" (
	@echo SpriteStudio ��.ssax �t�@�C���� .js �ɕϊ���.html �t�@�C�����J���܂��B
	@echo ���́F .ssax �t�@�C�� �摜�t�@�C��
	@echo ��x�ɕ����� .ssax ���w�肵�Ă͂����܂���
	@echo �L�����o�X�̃T�C�Y�̓A�j���[�V�����̃T�C�Y�ɘA�����܂���B
	@echo �ύX���K�v�ȏꍇ�ASsaView.html �t�@�C�����̉����ɂ��鉺�L�̏ꏊ�����������ĉ�����
	@echo canvas id="a_canvas" width="640" height="480"
	pause
	exit
)

setlocal

set _CD=%cd&
rem �h���C�u�ƃp�X�����̃R���o�[�^�̏ꏊ�ɕύX
%~d0
cd %~dp0

if not exist "tmp" mkdir "tmp"
cd tmp
del /Q *

rem �f�[�^���茳�ɃR�s�[���ă��l�[���B�f�[�^���̕ϐ������Œ肳���邽��
for %%F in (%*) do (
	xcopy %%F .\
)

ren *.ssax tmp.ssax

rem �R���o�[�g
..\..\..\..\Converter\bin\win\SsToHtml5 -i * -o PackedData > SsToHtml5.log
if ERRORLEVEL 1 (
	echo �G���[: %ERRORLEVEL%
	pause
) else (
	rem �y�[�W���u���E�U�ŊJ��
	cd ..
	start SsaView.html
)

cd %_CD%
