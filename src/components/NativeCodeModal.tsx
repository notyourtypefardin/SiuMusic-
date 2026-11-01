import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  X,
  Apple,
  Layers,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';

export const NativeCodeModal: React.FC = () => {
  const { isCodeModalOpen, setIsCodeModalOpen, codeModalPlatform, setCodeModalPlatform } = useMusic();
  const [copied, setCopied] = useState(false);

  if (!isCodeModalOpen) return null;

  const SWIFTUI_CODE = `//
// iOS 27 Liquid Glass Music UI in SwiftUI
// Apple Liquid Glass Design System
//

import SwiftUI

struct LiquidGlassCardView: View {
    let albumTitle: String
    let artistName: String
    let artworkName: String
    let tintIntensity: Double // 0.0 to 1.0 customizer slider
    
    @State private var isPressed = false
    @State private var dropletScale: CGFloat = 0.1
    @State private var dropletOpacity: Double = 0.0

    var body: some View {
        ZStack {
            // Optical Refraction Frosted Glass Pane
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(.ultraThinMaterial)
                .background(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.18 + tintIntensity * 0.20),
                            Color(red: 0.08, green: 0.10, blue: 0.16).opacity(0.65)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .blur(radius: 30) // iOS 27 Gaussian Blur specification
                .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                // Specular Refractive Top-Rim Sheen
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .strokeBorder(
                            LinearGradient(
                                colors: [
                                    Color.white.opacity(0.45),
                                    Color.white.opacity(0.12),
                                    Color.clear
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            ),
                            lineWidth: 1
                        )
                )
                // iOS 27 Calibrated Shadow Token
                .shadow(color: Color.black.opacity(0.20), radius: 10, x: 0, y: 4)

            // Card Content Hierarchy
            VStack(alignment: .leading, spacing: 12) {
                // Artwork Container with Refractive Edge
                Image(artworkName)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 180)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.25), lineWidth: 1)
                    )

                // Typography Hierarchy (SF Pro Display & SF Pro Text)
                VStack(alignment: .leading, spacing: 4) {
                    Text(albumTitle)
                        .font(.system(size: 22, weight: .bold, design: .default)) // SF Pro Display
                        .foregroundColor(.white)
                    
                    Text(artistName)
                        .font(.system(size: 15, weight: .regular, design: .default)) // SF Pro Text
                        .foregroundColor(.white.opacity(0.75))
                }
            }
            .padding(16)

            // Water Droplet Ripple Animation
            Circle()
                .fill(Color.white.opacity(dropletOpacity))
                .scaleEffect(dropletScale)
                .allowsHitTesting(false)
        }
        .scaleEffect(isPressed ? 0.96 : 1.0)
        .animation(.spring(response: 0.5, dampingFraction: 0.7), value: isPressed)
        .onTapGesture {
            triggerDropletRipple()
        }
    }

    private func triggerDropletRipple() {
        dropletScale = 0.1
        dropletOpacity = 0.8
        withAnimation(.easeOut(duration: 0.6)) {
            dropletScale = 2.4
            dropletOpacity = 0.0
        }
    }
}`;

  const UIKIT_CODE = `//
// iOS 27 Liquid Glass Music UI in UIKit
// Optical Refraction & UIVisualEffectView System
//

import UIKit

final class LiquidGlassAlbumCardCell: UICollectionViewCell {
    
    // Core Blur Effect Pane
    private let blurEffectView: UIVisualEffectView = {
        let blur = UIBlurEffect(style: .systemUltraThinMaterial)
        let view = UIVisualEffectView(effect: blur)
        view.layer.cornerRadius = 20.0
        view.clipsToBounds = true
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    // Specular Highlight Gradient Border
    private let specularBorderLayer: CAGradientLayer = {
        let gradient = CAGradientLayer()
        gradient.colors = [
            UIColor.white.withAlphaComponent(0.45).cgColor,
            UIColor.white.withAlphaComponent(0.10).cgColor,
            UIColor.clear.cgColor
        ]
        gradient.startPoint = CGPoint(x: 0.5, y: 0.0)
        gradient.endPoint = CGPoint(x: 0.5, y: 1.0)
        gradient.cornerRadius = 20.0
        return gradient
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupGlassHierarchy()
    }
    
    private func setupGlassHierarchy() {
        contentView.addSubview(blurEffectView)
        
        // Calibrated Shadow: 0 4px 10px rgba(0, 0, 0, 0.2)
        contentView.layer.shadowColor = UIColor.black.withAlphaComponent(0.20).cgColor
        contentView.layer.shadowOffset = CGSize(width: 0, height: 4)
        contentView.layer.shadowRadius = 10.0
        contentView.layer.shadowOpacity = 1.0
        contentView.layer.masksToBounds = false
        
        // Droplet Tap Animation
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(handleDropletTap(_:)))
        addGestureRecognizer(tapGesture)
    }

    @objc private func handleDropletTap(_ gesture: UITapGestureRecognizer) {
        let location = gesture.location(in: contentView)
        let rippleLayer = CAShapeLayer()
        let path = UIBezierPath(arcCenter: location, radius: 40, startAngle: 0, endAngle: .pi * 2, clockwise: true)
        rippleLayer.path = path.cgPath
        rippleLayer.fillColor = UIColor.white.withAlphaComponent(0.3).cgColor
        contentView.layer.addSublayer(rippleLayer)
        
        // CAAnimation for ~0.6s Droplet Wave
        let scaleAnim = CABasicAnimation(keyPath: "transform.scale")
        scaleAnim.fromValue = 0.1
        scaleAnim.toValue = 2.5
        
        let fadeAnim = CABasicAnimation(keyPath: "opacity")
        fadeAnim.fromValue = 0.8
        fadeAnim.toValue = 0.0
        
        let group = CAAnimationGroup()
        group.animations = [scaleAnim, fadeAnim]
        group.duration = 0.6
        group.timingFunction = CAMediaTimingFunction(controlPoints: 0.16, 1.0, 0.3, 1.0)
        rippleLayer.add(group, forKey: "dropletRipple")
    }
}`;

  const COMPOSE_CODE = `//
// Jetpack Compose Kotlin Implementation
// Cross-Platform Liquid Glass
//

@Composable
fun LiquidGlassCard(
    title: String,
    artist: String,
    tintIntensity: Float = 0.25f,
    onClick: () -> Unit
) {
    var isPressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.96f else 1.0f,
        animationSpec = spring(dampingRatio = 0.7f, stiffness = 450f)
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .shadow(
                elevation = 10.dp,
                shape = RoundedCornerShape(20.dp),
                ambientColor = Color.Black.copy(alpha = 0.2f),
                spotColor = Color.Black.copy(alpha = 0.2f)
            )
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color.White.copy(alpha = 0.18f + tintIntensity * 0.2f),
                        Color(0xFF0F121C).copy(alpha = 0.75f)
                    )
                ),
                shape = RoundedCornerShape(20.dp)
            )
            .border(
                width = 1.dp,
                brush = Brush.verticalGradient(
                    listOf(
                        Color.White.copy(alpha = 0.45f),
                        Color.White.copy(alpha = 0.10f),
                        Color.Transparent
                    )
                ),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Column {
            Text(
                text = title,
                style = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.White)
            )
            Text(
                text = artist,
                style = TextStyle(fontSize = 15.sp, color = Color.White.copy(alpha = 0.75f))
            )
        }
    }
}`;

  const currentCode =
    codeModalPlatform === 'swiftui'
      ? SWIFTUI_CODE
      : codeModalPlatform === 'uikit'
      ? UIKIT_CODE
      : COMPOSE_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    haptics.stateChange();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl liquid-glass-sheet rounded-[28px] overflow-hidden flex flex-col max-h-[88vh] border border-white/20 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 px-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl liquid-glass-card flex items-center justify-center text-white border border-white/20">
                <Code2 size={16} />
              </div>
              <div>
                <h3 className="text-sf-title-22 text-white font-semibold">
                  Liquid Glass Native Code
                </h3>
                <p className="text-sf-caption-13 text-slate-400 font-mono">
                  SwiftUI · UIKit · Jetpack Compose Reference
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                haptics.selection();
                setIsCodeModalOpen(false);
              }}
              className="p-2 rounded-xl liquid-glass-button text-slate-300 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Platform Tabs */}
          <div className="flex items-center gap-1.5 px-5 pt-3 border-b border-white/10 bg-black/20">
            <button
              onClick={() => {
                haptics.selection();
                setCodeModalPlatform('swiftui');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                codeModalPlatform === 'swiftui'
                  ? 'bg-white/20 text-white border-b-2 border-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple size={14} />
              <span>SwiftUI</span>
            </button>

            <button
              onClick={() => {
                haptics.selection();
                setCodeModalPlatform('uikit');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                codeModalPlatform === 'uikit'
                  ? 'bg-white/20 text-white border-b-2 border-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>UIKit</span>
            </button>

            <button
              onClick={() => {
                haptics.selection();
                setCodeModalPlatform('compose');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition-colors cursor-pointer ${
                codeModalPlatform === 'compose'
                  ? 'bg-white/20 text-white border-b-2 border-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Jetpack Compose</span>
            </button>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#050608]/90 font-mono text-xs text-slate-200 select-text leading-relaxed">
            <pre className="whitespace-pre-wrap">{currentCode}</pre>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 px-5 border-t border-white/10 bg-black/40">
            <div className="text-[11px] text-slate-400 font-mono">
              Tokens: 30px Blur · 20px Radius · 0 4px 10px Shadow · Code 4 Spring
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl liquid-glass-button text-xs font-bold text-white flex items-center gap-2 cursor-pointer border border-white/20"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? 'Copied Snippet' : 'Copy Code'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
