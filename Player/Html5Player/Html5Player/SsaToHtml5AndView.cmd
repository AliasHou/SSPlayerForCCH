@echo off

if "%*" == "" (
	@echo SpriteStudio ��.ssa �t�@�C���� .js �ɕϊ���.html �t�@�C�����J���܂��B
	@echo ���́F .ssa �t�@�C�� .ssf �t�@�C�� �摜�t�@�C��
	@echo ��x�ɕ����� .ssa .ssf ���w�肵�Ă͂����܂���
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

ren *.ssa tmp.ssa
ren *.ssf tmp.ssf

rem �R���o�[�g
..\..\Converter\SsaToHtml5 * -oPackedData > SsaToHtml5.log
if ERRORLEVEL 1 (
	echo �G���[: %ERRORLEVEL%
	pause
) else (
	rem �y�[�W���u���E�U�ŊJ��
	cd ..
	start SsaView.html
)

cd %_CD%
