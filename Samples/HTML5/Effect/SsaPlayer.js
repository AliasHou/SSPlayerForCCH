
////////////////////////////////////////////////////////////
// SsImageList
////////////////////////////////////////////////////////////

// loadImmediately, aOnLoad ����, setImage, setOnLoad ���\�b�h�ǉ� endo 20120703
function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoad) {

	this.fileRoot = aFileRoot;
	this.imagePaths = new Array();
	this.images = new Array();
	this.onLoad = aOnLoad;	// ���[�h�������ɌĂ΂��R�[���o�b�N

	// �S���ǂݍ��܂ꂽ�ꍇ�̂݃��[�U�[���ݒ肵���R�[���o�b�N���Ă�
	this.onLoad_ = function () {
		for (var i in this.images)
			if (i != null && i.complete == false)
				return;
		if (this.onLoad != null)
			this.onLoad();
	}

	for (var i = 0; i < imageFiles.length; i++) {
		var path = this.fileRoot + imageFiles[i];
//        console.log(path);  // added nanji 20120705
		this.imagePaths.push(path);
		var image = new Image();
		if (loadImmediately)
		{
			image.onload = this.onLoad_;
			image.src = path;
		}
		this.images.push(image);
	}
}

// �w�肵���C���f�b�N�X��Image��Ԃ�
SsImageList.prototype.getImage = function (index) {
	if (index < 0 || index >= this.images.length) return null;
	return this.images[index];
}

// �w�肵���C���f�b�N�X�̉摜��imagePath�ō����ւ���B
SsImageList.prototype.setImage = function (index, imagePath) {
	if (index < 0 || index >= this.images.length) return null;
	this.imagePaths[index] = this.fileRoot + imagePath;
	this.images[index].onload = this.onLoad_;
	this.images[index].src = this.imagePaths[index];
}

// ���[�h�������R�[���o�b�N��ݒ肷��
SsImageList.prototype.setOnLoad = function (cb) {
	this.onLoad = cb;
}


////////////////////////////////////////////////////////////
// SsPartState
////////////////////////////////////////////////////////////

function SsPartState(name) {

	// �p�[�c��
	this.name = name;
	// ���݂̕`��X�|�W�V����
	this.x = 0;
	// ���݂̕`��Y�|�W�V����
	this.y = 0;
}


////////////////////////////////////////////////////////////
// SsAnimation
////////////////////////////////////////////////////////////

function SsAnimation(ssaData, imageList) {

	this.ssaData = ssaData;
	this.imageList = imageList;

	this.partsMap = new Array();
	this.parts = ssaData.parts;
	for (var i = 0; i < this.parts.length; i++) {
		this.partsMap[this.parts[i]] = i;
	}
}

// ���̃A�j���[�V������FPS
SsAnimation.prototype.getFPS = function () {
	return this.ssaData.fps;
}

// �g�[�^���t���[������Ԃ�
SsAnimation.prototype.getFrameCount = function () {
	return this.ssaData.ssa.length;
}

// �p�[�c���X�g��Ԃ�
SsAnimation.prototype.getParts = function () {
	return this.ssaData.parts;
}

// �p�[�c������No���擾����}�b�v��Ԃ�
SsAnimation.prototype.getPartsMap = function () {
	return this.partsMap;
}

// �`�惁�\�b�h
SsAnimation.prototype.drawFunc = function (ctx, frameNo, x, y, flipH, flipV, partStates, scale) {

	var iPartNo = 0;
	var iImageNo = 1;
	var iSouX = 2;
	var iSouY = 3;
	var iSouW = 4;
	var iSouH = 5;
	var iDstX = 6;
	var iDstY = 7;
	var iDstAngle = 8;
	var iDstScaleX = 9;
	var iDstScaleY = 10;
	var iOrgX = 11;
	var iOrgY = 12;
	var iFlipH = 13;
	var iFlipV = 14;
	var iAlpha = 15;
	var iV0X = 16;
	var iV0Y = 17;

	var frameData = this.ssaData.ssa[frameNo];
	for (var refNo = 0; refNo < frameData.length; refNo++) {

		var partData = frameData[refNo];
		var partDataLen = partData.length;

		var partNo = partData[iPartNo];
		var img = this.imageList.getImage(partData[iImageNo]);
		var sx = partData[iSouX];
		var sy = partData[iSouY];
		var sw = partData[iSouW];
		var sh = partData[iSouH];
		var dx = partData[iDstX];
		var dy = partData[iDstY];

		var vdw = sw;
		var vdh = sh;

		// ����̒��_�ύX�̂ݔ��f
		if (partDataLen > iV0X) {
			dx += partData[iV0X];
			vdw -= partData[iV0X];
		}
		if (partDataLen > iV0Y) {
			dy += partData[iV0Y];
			vdh -= partData[iV0Y];
		}

		dx += x;
		dy += y;

		if (sw > 0 && sh > 0) {

			var dang = partData[iDstAngle];
			var scaleX = partData[iDstScaleX];
			var scaleY = partData[iDstScaleY];

			var ox = (partDataLen > iOrgX) ? partData[iOrgX] : 0;
			var oy = (partDataLen > iOrgY) ? partData[iOrgY] : 0;
			var fh = (partDataLen > iFlipH) ? (partData[iFlipH] != 0 ? -1 : 1) : (1);
			var fv = (partDataLen > iFlipV) ? (partData[iFlipV] != 0 ? -1 : 1) : (1);
			var alpha = (partDataLen > iAlpha) ? partData[iAlpha] : 1.0;

			ctx.globalAlpha = alpha;
			//ctx.setTransform(1, 0, 0, 1, dx, dy); 		// �ŏI�I�ȕ\���ʒu��
			ctx.setTransform(1 * scale, 0, 0, 1 * scale, dx * scale, dy * scale); 	// �ŏI�I�ȕ\���ʒu�� modified by nanji 20120717
			ctx.rotate(-dang); 							    // ��]
			ctx.scale(scaleX, scaleY); 			    		// �X�P�[��
			ctx.translate(-ox + vdw / 2, -oy + vdh / 2); 	// �p�[�c�̌��_��
			ctx.scale(fh, fv); 						    	// �p�[�c�̒��S�_�Ńt���b�v

			// check  : add nanji 20120708
			//
			//      console.log(sx, sy, sw, sh);
			//      sw = (sx + sw < img.width) ? sw : img.width - sx;
			//      sh = (sy + sh < img.height) ? sh : img.height - sy;
			//      sw = (sw < 0) ? 0 : sw;
			//      sh = (sh < 0) ? 0 : sh;
			//      sx = (sx < 0) ? 0 : sx;
			//      sy = (sy < 0) ? 0 : sy;
			//      console.log(sx, sy, sw, sh);

			ctx.drawImage(img, sx, sy, sw, sh, -vdw / 2, -vdh / 2, vdw, vdh);
		}

		var state = partStates[partNo];
		state.x = dx;
		state.y = dy;
	}
}


////////////////////////////////////////////////////////////
// SsSprite
////////////////////////////////////////////////////////////

function SsSprite(animation) {

	// �v���C�x�[�g�ϐ�
	this.inner = {
		animation: animation,
		playingFrame: 0,
		prevDrawnTime: 0,
		step: 1,
		loop: 0,
		loopCount: 0,
		endCallBack: null,    // draw end callback

		partStates: null,
		initPartStates: function () {
			this.partStates = null;
			if (this.animation != null) {
				var parts = this.animation.getParts();
				var states = new Array();
				for (var i = 0; i < parts.length; i++) {
					states.push(new SsPartState(parts[i]));
				}
				this.partStates = states;
			}
		}
	};

	this.inner.initPartStates();
}

// �`��X�|�W�V����
SsSprite.prototype.x = 0;
// �`��Y�|�W�V����
SsSprite.prototype.y = 0;

// ��������
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// scale  -- added by nanji 20120717
SsSprite.prototype.scale = 1.0;

// �A�j���[�V�����̐ݒ�
SsSprite.prototype.setAnimation = function (animation) {
	this.inner.animation = animation;
	this.inner.initPartStates();
	this.inner.playingFrame = 0;
	this.inner.prevDrawnTime = 0;
	this.clearLoopCount();
}
// �A�j���[�V�����̎擾
SsSprite.prototype.getanimation = function () {
	return this.inner.animation;
}

// �Đ��t���[��No��ݒ�
SsSprite.prototype.setFrameNo = function (frameNo) {
	this.inner.playingFrame = frameNo;
	this.inner.prevDrawnTime = 0;
}
// �Đ��t���[��No���擾
SsSprite.prototype.getFrameNo = function () {
	return this.inner.playingFrame >> 0;
}

// �Đ��X�s�[�h��ݒ� (1:�W��)
SsSprite.prototype.setStep = function (step) {
	this.inner.step = step;
}
// �Đ��X�s�[�h���擾
SsSprite.prototype.getStep = function () {
	return this.inner.step;
}

// ���[�v�񐔂̐ݒ� (0:����)
SsSprite.prototype.setLoop = function (loop) {
	if (loop < 0) return;
	this.inner.loop = loop;
}
// ���[�v�񐔂̐ݒ���擾
SsSprite.prototype.getLoop = function () {
	return this.inner.loop;
}

// ���݂̍Đ��񐔂��擾
SsSprite.prototype.getLoopCount = function () {
	return this.inner.loopCount;
}
// ���݂̍Đ��񐔂��N���A
SsSprite.prototype.clearLoopCount = function () {
	this.inner.loopCount = 0;
}

// add nanji 20120623
// �A�j���[�V�����I�����̃R�[���o�b�N��ݒ�
SsSprite.prototype.setEndCallBack = function (func) {
	this.inner.endCallBack = func;
}

// �p�[�c�̏�ԁi���݂�X,Y���W�Ȃǁj���擾
SsSprite.prototype.getPartState = function (name) {
	if (this.inner.partStates == null) return null;

	var partsMap = this.inner.animation.getPartsMap();
	var partNo = partsMap[name];
	if (partNo == null) return null;
	return this.inner.partStates[partNo];
}

// �`����s
SsSprite.prototype.draw = function (ctx, currentTime) {

	if (this.inner.animation == null) return;

	if (this.inner.loop == 0 || this.inner.loop > this.inner.loopCount) {
		// �t���[����i�߂�
		if (this.inner.prevDrawnTime > 0) {

			var s = (currentTime - this.inner.prevDrawnTime) / (1000 / this.inner.animation.getFPS());
			this.inner.playingFrame += s * this.inner.step;

			var c = (this.inner.playingFrame / this.inner.animation.getFrameCount()) >> 0;

			if (this.inner.step >= 0) {
				if (this.inner.playingFrame >= this.inner.animation.getFrameCount()) {
					// ���[�v�񐔍X�V
					this.inner.loopCount += c;
					// endo add 20120702
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// �t���[���ԍ��X�V�A�Đ��𑱂���
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
					}
					else {
						// �Đ���~�A�ŏI�t���[����
						this.inner.playingFrame = this.inner.animation.getFrameCount() - 1;
						// ��~���R�[���o�b�N�Ăяo��
						if (this.inner.endCallBack != null) {
							this.inner.endCallBack();
						}
					}
				}
			}
			else {
				if (this.inner.playingFrame < 0) {
					// ���[�v�񐔍X�V
					this.inner.loopCount += 1 + -c;
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// �t���[���ԍ��X�V�A�Đ��𑱂���
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
						if (this.inner.playingFrame < 0) this.inner.playingFrame += this.inner.animation.getFrameCount();
					}
					else {
						// �Đ���~�A�擪�t���[����
						this.inner.playingFrame = 0;
						// ��~���R�[���o�b�N�Ăяo��
						if (this.inner.endCallBack != null) {
							this.inner.endCallBack();
						}
					}
				}
			}

		}
	}
	//else {
	//	// �Đ���~
	//	this.inner.playingFrame = 0;
	//}

	this.inner.prevDrawnTime = currentTime;

	this.inner.animation.drawFunc(ctx, this.getFrameNo(), this.x, this.y, this.flipH, this.flipV, this.inner.partStates, this.scale);
}

